import { XMLParser } from "fast-xml-parser"

export interface NfeItem {
  code: string
  name: string
  unit: string
  quantity: number
  unitPrice: number
  totalPrice: number
  batchNumber: string | null
  expiryDate: string | null
}

export interface NfeParsed {
  nfeKey: string
  supplierName: string
  issueDate: string
  totalAmount: number
  items: NfeItem[]
}

export function parseNfeXml(xmlContent: string): NfeParsed {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    parseAttributeValue: true,
  })

  const parsed = parser.parse(xmlContent)

  // Navigate to nfeProc or nfeProc.NFe.infNFe
  const nfeProc = parsed.nfeProc ?? parsed
  const nfe = nfeProc.NFe ?? nfeProc
  const infNFe = nfe.infNFe ?? nfe

  const chNFe: string =
    infNFe?.["@_Id"]?.replace("NFe", "") ??
    nfeProc.protNFe?.infProt?.chNFe ??
    ""

  const emit = infNFe.emit ?? {}
  const supplierName: string = emit.xNome ?? emit.xFant ?? "Fornecedor desconhecido"

  const ide = infNFe.ide ?? {}
  const issueDate: string = (ide.dhEmi ?? ide.dEmi ?? new Date().toISOString()).substring(0, 10)

  const total = infNFe.total?.ICMSTot ?? {}
  const totalAmount = Number(total.vNF ?? 0)

  const detRaw = infNFe.det ?? []
  const detArray = Array.isArray(detRaw) ? detRaw : [detRaw]

  const items: NfeItem[] = detArray.map((det) => {
    const prod = det.prod ?? {}
    const rastr = prod.rastro ?? null
    const rastrArray = rastr ? (Array.isArray(rastr) ? rastr : [rastr]) : []

    const batchNumber: string | null = rastrArray[0]?.nLote ?? null
    const expiryRaw: string | null = rastrArray[0]?.dVal ?? null
    let expiryDate: string | null = null
    if (expiryRaw) {
      // Format: YYYY-MM or YYYY-MM-DD
      if (expiryRaw.length === 7) {
        // YYYY-MM → last day of month
        const [y, m] = expiryRaw.split("-")
        const lastDay = new Date(Number(y), Number(m), 0).getDate()
        expiryDate = `${y}-${m}-${String(lastDay).padStart(2, "0")}`
      } else {
        expiryDate = expiryRaw.substring(0, 10)
      }
    }

    return {
      code: String(prod.cProd ?? ""),
      name: String(prod.xProd ?? "Item"),
      unit: String(prod.uCom ?? "unit").toLowerCase(),
      quantity: Number(prod.qCom ?? 0),
      unitPrice: Number(prod.vUnCom ?? 0),
      totalPrice: Number(prod.vProd ?? 0),
      batchNumber,
      expiryDate,
    }
  })

  return {
    nfeKey: chNFe,
    supplierName,
    issueDate,
    totalAmount,
    items,
  }
}

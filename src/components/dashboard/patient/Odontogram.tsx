"use client"

import { useState } from "react"
import { PERMANENT_TEETH, DECIDUOUS_TEETH, FACE_COLORS, TOOTH_CONDITIONS, FACE_LABELS, SYMBOL_LABELS } from "@/lib/odontogram/teeth"
import type { FaceStatus, ToothFace } from "@/lib/odontogram/teeth"
import { upsertFaceMark, removeFaceMark, upsertToothSymbol } from "@/app/actions/odontogram"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import type { Tables } from "@/types/database"

type FaceMark = Tables<"tooth_face_marks">
type Symbol = Tables<"tooth_symbols">

interface Props {
  patientId: string
  clinicId: string
  faceMarks: FaceMark[]
  symbols: Symbol[]
  readOnly?: boolean
}

type ToothMode = 'permanent' | 'deciduous'

export function Odontogram({ patientId, clinicId, faceMarks, symbols, readOnly }: Props) {
  const [mode, setMode] = useState<ToothMode>('permanent')
  const [loading, setLoading] = useState(false)

  const teeth = mode === 'permanent' ? PERMANENT_TEETH : DECIDUOUS_TEETH

  const getFaceMark = (tooth: number, face: string) =>
    faceMarks.find((m) => m.tooth_number === tooth && m.face === face)

  const getSymbols = (tooth: number) =>
    symbols.filter((s) => s.tooth_number === tooth)

  async function handleFaceSave(
    toothNumber: number,
    face: ToothFace,
    condition: string,
    markStatus: FaceStatus,
    notes: string,
  ) {
    if (readOnly) return
    setLoading(true)
    try {
      await upsertFaceMark({
        patientId,
        clinicId,
        toothNumber,
        face,
        condition: condition as FaceMark['condition'],
        markStatus,
        notes,
      })
      toast.success("Marcação salva")
    } catch {
      toast.error("Erro ao salvar marcação")
    } finally {
      setLoading(false)
    }
  }

  async function handleSymbolSave(toothNumber: number, symbol: string, status: 'planned' | 'done') {
    if (readOnly) return
    setLoading(true)
    try {
      await upsertToothSymbol({
        patientId,
        clinicId,
        toothNumber,
        symbol: symbol as Parameters<typeof upsertToothSymbol>[0]['symbol'],
        status,
      })
      toast.success("Símbolo salvo")
    } catch {
      toast.error("Erro ao salvar símbolo")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Toggle permanent/deciduous */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setMode('permanent')}
          className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
            mode === 'permanent' ? 'bg-[#0D3A6B] text-white' : 'bg-slate-100 text-slate-600'
          }`}
        >
          Dentição Permanente
        </button>
        <button
          onClick={() => setMode('deciduous')}
          className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
            mode === 'deciduous' ? 'bg-[#0D3A6B] text-white' : 'bg-slate-100 text-slate-600'
          }`}
        >
          Dentição Decídua
        </button>
      </div>

      {/* Legenda */}
      <div className="flex items-center gap-4 text-xs">
        {Object.entries(FACE_COLORS).map(([k, color]) => (
          <span key={k} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ background: color }} />
            {k === 'planned' ? 'A fazer' : k === 'done' ? 'Feito' : 'Já existia'}
          </span>
        ))}
      </div>

      {/* Arcada superior */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs text-slate-400 font-medium">Superior</span>
        <div className="flex gap-1 flex-wrap justify-center">
          {[...teeth.upperRight, ...teeth.upperLeft].map((num) => (
            <ToothCell
              key={num}
              toothNumber={num}
              isUpper
              getFaceMark={getFaceMark}
              getSymbols={getSymbols}
              onFaceSave={handleFaceSave}
              onSymbolSave={handleSymbolSave}
              readOnly={readOnly}
              loading={loading}
            />
          ))}
        </div>
      </div>

      {/* Linha divisória */}
      <div className="border-dashed border-t-2 border-slate-200 dark:border-slate-700 mx-4" />

      {/* Arcada inferior */}
      <div className="flex flex-col items-center gap-1">
        <div className="flex gap-1 flex-wrap justify-center">
          {[...teeth.lowerLeft.slice().reverse(), ...teeth.lowerRight].map((num) => (
            <ToothCell
              key={num}
              toothNumber={num}
              isUpper={false}
              getFaceMark={getFaceMark}
              getSymbols={getSymbols}
              onFaceSave={handleFaceSave}
              onSymbolSave={handleSymbolSave}
              readOnly={readOnly}
              loading={loading}
            />
          ))}
        </div>
        <span className="text-xs text-slate-400 font-medium">Inferior</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Sub-componente: um dente
// ─────────────────────────────────────────────
function ToothCell({
  toothNumber,
  isUpper,
  getFaceMark,
  getSymbols,
  onFaceSave,
  onSymbolSave,
  readOnly,
  loading,
}: {
  toothNumber: number
  isUpper: boolean
  getFaceMark: (tooth: number, face: string) => ReturnType<Props['faceMarks']['find']>
  getSymbols: (tooth: number) => Props['symbols']
  onFaceSave: (tooth: number, face: ToothFace, condition: string, markStatus: FaceStatus, notes: string) => void
  onSymbolSave: (tooth: number, symbol: string, status: 'planned' | 'done') => void
  readOnly?: boolean
  loading: boolean
}) {
  const toothSymbols = getSymbols(toothNumber)
  const hasX = toothSymbols.some((s) => s.symbol === 'extraction' || s.symbol === 'missing')

  const faces: { id: ToothFace; label: string }[] = [
    { id: 'vestibular', label: 'V' },
    { id: 'mesial', label: 'M' },
    { id: 'occlusal', label: 'O' },
    { id: 'distal', label: 'D' },
    { id: 'lingual', label: 'L' },
  ]

  return (
    <div className="flex flex-col items-center gap-0.5 w-12">
      {/* Número */}
      <span className={`text-[10px] font-mono text-slate-400 ${isUpper ? '' : 'order-last'}`}>
        {toothNumber}
      </span>

      {/* SVG do dente */}
      <Popover>
        <PopoverTrigger disabled={readOnly || loading}>
          <svg width="44" height="44" viewBox="0 0 44 44" className="cursor-pointer hover:opacity-80 transition-opacity">
            {/* Vestibular (topo no superior, base no inferior) */}
            <rect
              x="11" y={isUpper ? 2 : 32} width="22" height="10"
              rx="2"
              fill={(() => { const m = getFaceMark(toothNumber, 'vestibular'); return m ? FACE_COLORS[m.mark_status as FaceStatus] : '#e2e8f0' })()}
              stroke="#94a3b8" strokeWidth="0.5"
            />
            {/* Lingual (base no superior, topo no inferior) */}
            <rect
              x="11" y={isUpper ? 32 : 2} width="22" height="10"
              rx="2"
              fill={(() => { const m = getFaceMark(toothNumber, 'lingual'); return m ? FACE_COLORS[m.mark_status as FaceStatus] : '#e2e8f0' })()}
              stroke="#94a3b8" strokeWidth="0.5"
            />
            {/* Mesial (esquerda) */}
            <rect
              x="2" y="11" width="10" height="22"
              rx="2"
              fill={(() => { const m = getFaceMark(toothNumber, 'mesial'); return m ? FACE_COLORS[m.mark_status as FaceStatus] : '#e2e8f0' })()}
              stroke="#94a3b8" strokeWidth="0.5"
            />
            {/* Distal (direita) */}
            <rect
              x="32" y="11" width="10" height="22"
              rx="2"
              fill={(() => { const m = getFaceMark(toothNumber, 'distal'); return m ? FACE_COLORS[m.mark_status as FaceStatus] : '#e2e8f0' })()}
              stroke="#94a3b8" strokeWidth="0.5"
            />
            {/* Oclusal (centro) */}
            <rect
              x="14" y="14" width="16" height="16"
              rx="3"
              fill={(() => { const m = getFaceMark(toothNumber, 'occlusal'); return m ? FACE_COLORS[m.mark_status as FaceStatus] : '#f8fafc' })()}
              stroke="#94a3b8" strokeWidth="0.5"
            />
            {/* X para extração */}
            {hasX && (
              <>
                <line x1="8" y1="8" x2="36" y2="36" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="36" y1="8" x2="8" y2="36" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
              </>
            )}
          </svg>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-3 space-y-3" side="top">
          <FaceMarkEditor
            toothNumber={toothNumber}
            getFaceMark={getFaceMark}
            faces={faces}
            onSave={onFaceSave}
          />
          <SymbolEditor
            toothNumber={toothNumber}
            existingSymbols={toothSymbols}
            onSave={onSymbolSave}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

function FaceMarkEditor({
  toothNumber,
  getFaceMark,
  faces,
  onSave,
}: {
  toothNumber: number
  getFaceMark: (tooth: number, face: string) => ReturnType<Props['faceMarks']['find']>
  faces: { id: ToothFace; label: string }[]
  onSave: (tooth: number, face: ToothFace, condition: string, markStatus: FaceStatus, notes: string) => void
}) {
  const [selectedFace, setSelectedFace] = useState<ToothFace>('occlusal')
  const [markStatus, setMarkStatus] = useState<FaceStatus>('planned')
  const [condition, setCondition] = useState('cavity')
  const [notes, setNotes] = useState('')

  const existing = getFaceMark(toothNumber, selectedFace)

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-slate-600">Dente {toothNumber} — Face</p>
      <div className="flex gap-1 flex-wrap">
        {faces.map((f) => {
          const m = getFaceMark(toothNumber, f.id)
          return (
            <button
              key={f.id}
              onClick={() => setSelectedFace(f.id)}
              className={`text-[10px] px-2 py-1 rounded border transition-colors ${
                selectedFace === f.id ? 'bg-[#0D3A6B] text-white border-[#0D3A6B]' : 'border-slate-200'
              }`}
              style={m ? { borderColor: FACE_COLORS[m.mark_status as FaceStatus] } : undefined}
            >
              {f.label}
            </button>
          )
        })}
      </div>
      <div className="space-y-1">
        <Label className="text-[10px]">Status</Label>
        <div className="flex gap-1">
          {(['planned', 'done', 'existing'] as FaceStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => setMarkStatus(s)}
              className={`text-[10px] px-2 py-1 rounded border ${markStatus === s ? 'font-semibold' : ''}`}
              style={{ borderColor: FACE_COLORS[s], color: markStatus === s ? 'white' : undefined, background: markStatus === s ? FACE_COLORS[s] : undefined }}
            >
              {s === 'planned' ? 'A fazer' : s === 'done' ? 'Feito' : 'Existia'}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-1">
        <Label className="text-[10px]">Condição</Label>
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="w-full text-xs border rounded px-2 py-1 bg-white dark:bg-slate-800"
        >
          {TOOTH_CONDITIONS.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Observações..."
        rows={2}
        className="text-xs"
      />
      <Button
        size="sm"
        className="w-full bg-[#0D3A6B] hover:bg-[#1A5599] text-white text-xs h-7"
        onClick={() => onSave(toothNumber, selectedFace, condition, markStatus, notes)}
      >
        Salvar face
      </Button>
    </div>
  )
}

function SymbolEditor({
  toothNumber,
  existingSymbols,
  onSave,
}: {
  toothNumber: number
  existingSymbols: Props['symbols']
  onSave: (tooth: number, symbol: string, status: 'planned' | 'done') => void
}) {
  return (
    <div className="space-y-2 border-t pt-2">
      <p className="text-[10px] font-semibold text-slate-500">Símbolos</p>
      <div className="flex flex-wrap gap-1">
        {Object.entries(SYMBOL_LABELS).map(([sym, label]) => {
          const existing = existingSymbols.find((s) => s.symbol === sym)
          return (
            <button
              key={sym}
              onClick={() => onSave(toothNumber, sym, existing?.status === 'done' ? 'planned' : 'done')}
              className={`text-[10px] px-2 py-1 rounded border transition-colors ${
                existing ? 'bg-[#0D3A6B] text-white border-[#0D3A6B]' : 'border-slate-200'
              }`}
              title={label}
            >
              {sym === 'extraction' ? 'X' : sym === 'root_canal' ? 'RC' : sym === 'missing' ? '/' : sym === 'implant' ? 'IMP' : 'COR'}
            </button>
          )
        })}
      </div>
    </div>
  )
}

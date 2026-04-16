"use client"

import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function PortalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4 px-4">
      <AlertTriangle className="h-12 w-12 text-red-500" />
      <div>
        <h2 className="text-xl font-bold">Algo deu errado</h2>
        <p className="text-muted-foreground mt-1 text-sm">Não foi possível carregar esta página.</p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-4 py-2 bg-[#0D3A6B] text-white rounded-xl text-sm font-medium"
        >
          Tentar novamente
        </button>
        <Link href="/" className="px-4 py-2 border rounded-xl text-sm font-medium">
          Início
        </Link>
      </div>
    </div>
  )
}

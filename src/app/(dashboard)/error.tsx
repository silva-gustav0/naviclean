"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function DashboardError({
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
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
        <AlertTriangle className="h-8 w-8 text-red-600" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Algo deu errado</h2>
        <p className="text-muted-foreground mt-1 text-sm max-w-sm">
          Ocorreu um erro inesperado ao carregar esta página. Tente novamente.
        </p>
      </div>
      <button
        onClick={reset}
        className="flex items-center gap-2 px-4 py-2 bg-[#0D3A6B] text-white rounded-xl text-sm font-medium hover:bg-[#1A5599] transition-colors"
      >
        <RefreshCw className="h-4 w-4" />
        Tentar novamente
      </button>
    </div>
  )
}

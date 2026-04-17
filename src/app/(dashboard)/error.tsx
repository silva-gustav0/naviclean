"use client"

import { useEffect } from "react"

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
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
        <span className="material-symbols-outlined text-red-600" style={{ fontSize: 32 }}>error</span>
      </div>
      <div>
        <h2 className="font-headline font-extrabold text-xl text-on-surface">Algo deu errado</h2>
        <p className="text-on-surface-variant mt-1 text-sm max-w-sm">
          Ocorreu um erro inesperado ao carregar esta página. Tente novamente.
        </p>
      </div>
      <button
        onClick={reset}
        className="flex items-center gap-2 surgical-gradient text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-premium-sm hover:opacity-90 transition-opacity"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>refresh</span>
        Tentar novamente
      </button>
    </div>
  )
}

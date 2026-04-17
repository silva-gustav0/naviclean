"use client"

import { useEffect } from "react"
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
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
        <span className="material-symbols-outlined text-red-500" style={{ fontSize: 32 }}>error</span>
      </div>
      <div>
        <h2 className="font-headline font-extrabold text-xl text-on-surface">Algo deu errado</h2>
        <p className="text-on-surface-variant mt-1 text-sm">Não foi possível carregar esta página.</p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-4 py-2 surgical-gradient text-white rounded-xl text-sm font-semibold shadow-premium-sm hover:opacity-90 transition-opacity"
        >
          Tentar novamente
        </button>
        <Link href="/" className="px-4 py-2 border border-outline-variant text-on-surface-variant rounded-xl text-sm font-medium hover:bg-surface-container transition-colors">
          Início
        </Link>
      </div>
    </div>
  )
}

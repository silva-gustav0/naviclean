"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { Loader2, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { useClinicConfig, getCatalogTypeFilter } from "@/lib/clinic-config-context"

export type CatalogProcedureRow = {
  id: number; code: string; name: string
  category: string | null; specialty: string | null; type: string | null; duration_min: number; clinic_type: string | null
}
export type CatalogStockRow = {
  id: number; code: string; name: string
  category: string | null; clinic_type: string | null; presentation: string | null; frequency_class: string | null
}
export type CatalogExpenseRow = {
  id: number; code: string; description: string
  category: string | null; type: string | null; periodicity: string | null; estimated_value: number | null; recipient: string | null
}

type CatalogTable = "catalog_procedures" | "catalog_stock_items" | "catalog_fixed_expenses"

// catalog_fixed_expenses is clinic-agnostic (costs are the same regardless of specialty)
const FILTERABLE_TABLES: CatalogTable[] = ["catalog_procedures", "catalog_stock_items"]

interface CatalogComboboxProps {
  table: CatalogTable
  searchColumn: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  onSelect: (item: Record<string, unknown>) => void
  renderItem?: (item: Record<string, unknown>) => React.ReactNode
  name?: string
  inputClassName?: string
  required?: boolean
}

export function CatalogCombobox({
  table,
  searchColumn,
  placeholder,
  value,
  onChange,
  onSelect,
  renderItem,
  name,
  inputClassName,
  required,
}: CatalogComboboxProps) {
  const { clinicType, userRole } = useClinicConfig()
  const typeFilter = FILTERABLE_TABLES.includes(table)
    ? getCatalogTypeFilter(clinicType, userRole)
    : null

  const [results, setResults] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const search = useCallback(
    async (query: string) => {
      if (query.trim().length < 2) {
        setResults([])
        setOpen(false)
        return
      }
      setLoading(true)
      const supabase = createClient()
      let q = supabase
        .from(table)
        .select("*")
        .ilike(searchColumn, `%${query}%`)
        .limit(8)

      if (typeFilter) {
        q = q.in("clinic_type", typeFilter)
      }

      const { data } = await q
      setResults((data as Record<string, unknown>[]) ?? [])
      setOpen((data?.length ?? 0) > 0)
      setLoading(false)
    },
    [table, searchColumn, typeFilter]
  )

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(value), 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [value, search])

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleOutside)
    return () => document.removeEventListener("mousedown", handleOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <input
          name={name}
          type="text"
          value={value}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          className={cn(
            "w-full pl-9 pr-9 py-2.5 text-sm border rounded-xl bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2",
            inputClassName
          )}
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 animate-spin text-muted-foreground" />
        )}
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-card border rounded-xl shadow-lg overflow-hidden">
          <ul className="py-1 max-h-52 overflow-y-auto divide-y divide-border/40">
            {results.map((item) => (
              <li
                key={item.id as number}
                onMouseDown={(e) => {
                  e.preventDefault()
                  onSelect(item)
                  setOpen(false)
                }}
                className="px-3 py-2 hover:bg-muted cursor-pointer"
              >
                {renderItem ? (
                  renderItem(item)
                ) : (
                  <span className="text-sm">{String(item[searchColumn] ?? "")}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default function PortalLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6 animate-pulse">
      <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}

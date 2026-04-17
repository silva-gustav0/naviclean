export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-surface-container-low rounded-xl w-48" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-28 bg-surface-container-low rounded-2xl" />
        ))}
      </div>
      <div className="h-64 bg-surface-container-low rounded-2xl" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 bg-surface-container-low rounded-xl" />
        ))}
      </div>
    </div>
  )
}

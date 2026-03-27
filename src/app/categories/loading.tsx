export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-10 w-48 bg-muted rounded-lg"></div>
        <div className="h-10 w-40 bg-muted rounded-lg"></div>
      </div>
      <div className="flex gap-2 mb-6">
        <div className="h-10 w-16 bg-muted rounded-lg"></div>
        <div className="h-10 w-24 bg-muted rounded-lg"></div>
        <div className="h-10 w-24 bg-muted rounded-lg"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-20 w-full bg-muted rounded-xl"></div>
        ))}
      </div>
    </div>
  )
}

export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-10 w-48 bg-muted rounded-lg"></div>
        <div className="h-10 w-40 bg-muted rounded-lg"></div>
      </div>
      <div className="h-24 w-full bg-muted rounded-xl"></div>
      <div className="h-[400px] w-full bg-muted rounded-xl"></div>
    </div>
  )
}

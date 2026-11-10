import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48 rounded-lg" />
          <Skeleton className="h-4 w-72 rounded-md" />
        </div>
        <Skeleton className="h-9 w-36 rounded-lg" />
      </div>

      <div className="h-14 rounded-xl border bg-card p-3 flex gap-3">
        <Skeleton className="h-full flex-1 rounded-lg" />
        <Skeleton className="h-full w-40 rounded-lg" />
        <Skeleton className="h-full w-40 rounded-lg" />
      </div>

      <div className="rounded-xl border bg-card p-4 space-y-3">
        <Skeleton className="h-8 w-full rounded-md" />
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-md" />
        ))}
      </div>
    </div>
  );
}

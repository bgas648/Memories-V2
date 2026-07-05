export function PhotoGridSkeleton({ count = 12 }: { count?: number }) {
  const heights = [220, 300, 180, 260, 340, 200, 280, 240];
  return (
    <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 [column-fill:_balance]">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="skeleton rounded-2xl mb-3 w-full break-inside-avoid"
          style={{ height: heights[i % heights.length] }}
        />
      ))}
    </div>
  );
}

export function AlbumGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <div className="skeleton rounded-2xl aspect-square w-full" />
          <div className="skeleton h-4 rounded-full w-3/4 mt-3" />
          <div className="skeleton h-3 rounded-full w-1/3 mt-2" />
        </div>
      ))}
    </div>
  );
}

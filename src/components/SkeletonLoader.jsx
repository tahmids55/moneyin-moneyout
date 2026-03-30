export default function SkeletonLoader({ rows = 3, className = '' }) {
  return (
    <div className={`grid gap-3 ${className}`}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="skeleton-row" />
      ))}
    </div>
  )
}

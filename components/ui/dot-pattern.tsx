import { cn } from '@/lib/utils'

interface DotPatternProps {
  width?: number
  height?: number
  cx?: number
  cy?: number
  r?: number
  className?: string
  id?: string
}

export function DotPattern({
  width = 28,
  height = 28,
  cx = 1,
  cy = 1,
  r = 1,
  className,
  id = 'dot-pattern',
}: DotPatternProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 h-full w-full fill-[rgba(79,127,255,0.15)]',
        className,
      )}
    >
      <defs>
        <pattern
          id={id}
          x={0}
          y={0}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
        >
          <circle cx={cx} cy={cy} r={r} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

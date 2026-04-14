type Props = {
  title: string
  value: string
  trend?: string
}

export function StatCard({ title, value, trend }: Props) {
  const positive = trend?.startsWith('+')

  return (
    <div className="bg-white border border-base-200 rounded-xl p-5 shadow-sm">
      <div className="text-sm text-base-600 mb-2">
        {title}
      </div>

      <div className="flex items-end justify-between">
        <span className="text-2xl font-semibold text-base-800">
          {value}
        </span>

        {trend && (
          <span
            className={`
              text-xs font-medium px-2 py-1 rounded-full
              ${positive
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'}
            `}
          >
            {trend}
          </span>
        )}
      </div>
    </div>
  )
}
import { PropsWithChildren, useEffect, useRef, useState } from 'react'

type Props = PropsWithChildren<{
  trigger: React.ReactNode
  align?: 'left' | 'right'
}>

export default function Dropdown({
  trigger,
  align = 'right',
  children,
}: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(v => !v)}>
        {trigger}
      </button>

      {open && (
        <div
          className={`
            absolute mt-2 min-w-[180px]
            rounded-md border border-base-200
            bg-white shadow-lg z-50
            ${align === 'right' ? 'right-0' : 'left-0'}
          `}
        >
          {children}
        </div>
      )}
    </div>
  )
}
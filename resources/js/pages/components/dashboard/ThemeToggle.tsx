import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const enabled = stored ? stored === 'dark' : prefersDark

    setDark(enabled)
    document.documentElement.classList[enabled ? 'add' : 'remove']('dark')
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.classList[next ? 'add' : 'remove']('dark')
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-md hover:bg-base-100 dark:hover:bg-base-500 transition"
      aria-label="Alternar tema"
    >
      {dark ?
       <Sun className='h-6 w-6' /> :
       <Moon className='h-6 w-6'/>}
    </button>
  )
}
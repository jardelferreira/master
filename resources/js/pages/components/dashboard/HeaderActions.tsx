import ThemeToggle from './ThemeToggle'
import Notifications from '@/pages/components/Notifications'

export default function HeaderActions() {
  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      <Notifications count={3} />
    </div>
  )
}
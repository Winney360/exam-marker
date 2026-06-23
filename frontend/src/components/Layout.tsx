import { Outlet, NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.tsx'
import Logo from './Logo.tsx'

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/assessments', label: 'Assessments' },
  { to: '/grading', label: 'Grading' },
]

export default function Layout() {
  const { user, logout } = useAuth()
  return (
    <div className="flex h-screen bg-slate-950">
      <aside className="w-64 bg-slate-900/60 backdrop-blur-md border-r border-slate-800/80 flex flex-col">
        <div className="p-6 border-b border-slate-800/60">
          <div className="flex items-center gap-2">
            <Logo />
            <h1 className="text-xl font-bold text-slate-100">Rio</h1>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-teal-400/10 text-teal-300 border border-teal-500/20'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800/60 space-y-2">
          {user && (
            <p className="text-xs text-slate-500 px-4 truncate">{user.name} ({user.email})</p>
          )}
          <button
            type="button"
            onClick={logout}
            className="w-full px-4 py-2 text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-left"
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-slate-950">
        <Outlet />
      </main>
    </div>
  )
}

import { Outlet, NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.tsx'

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/assessments', label: 'Assessments' },
  { to: '/grading', label: 'Grading' },
]

export default function Layout() {
  const { user, logout } = useAuth()
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-indigo-600">Rio</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200 space-y-2">
          {user && (
            <p className="text-xs text-gray-400 px-4 truncate">{user.name} ({user.email})</p>
          )}
          <button
            type="button"
            onClick={logout}
            className="w-full px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

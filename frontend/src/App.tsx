import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.tsx'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<div className="p-8"><h1 className="text-2xl font-bold">Dashboard</h1></div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App

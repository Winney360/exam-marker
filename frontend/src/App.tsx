import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'
import Layout from './components/Layout.tsx'
import Home from './pages/Home.tsx'
import Login from './pages/Login.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Assessments from './pages/Assessments.tsx'
import AssessmentDetail from './pages/AssessmentDetail.tsx'
import ScriptReview from './pages/ScriptReview.tsx'
import Analytics from './pages/Analytics.tsx'
import Grading from './pages/Grading.tsx'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/assessments" element={<Assessments />} />
            <Route path="/assessments/:id" element={<AssessmentDetail />} />
            <Route path="/assessments/:id/analytics" element={<Analytics />} />
            <Route path="/scripts/:id" element={<ScriptReview />} />
          </Route>
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/grading/:assessmentId/:scriptId" element={<Grading />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App

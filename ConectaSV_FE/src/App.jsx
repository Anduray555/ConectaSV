import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'

import DashboardLayout from './layouts/DashboardLayout'
import Explorar from './pages/dashboard/Explorar'
import Mensajes from './pages/dashboard/Mensajes'
import DocumentosSS from './pages/dashboard/DocumentosSS'
import MiPerfil from './pages/dashboard/MiPerfil'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />


      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Navigate to="explorar" replace />} />
        <Route path="explorar" element={<Explorar />} />
        <Route path="mensajes" element={<Mensajes />} />
        <Route path="documentos" element={<DocumentosSS />} />
        <Route path="perfil" element={<MiPerfil />} />
      </Route>
    </Routes>
  )
}

export default App
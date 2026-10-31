import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import RecoverPassword from './pages/RecoverPassword'

import DashboardLayout from './layouts/DashboardLayout'
import Explorar from './pages/dashboard/Explorar'
import Mensajes from './pages/dashboard/Mensajes'
import DocumentosSS from './pages/dashboard/DocumentosSS'
import MiPerfil from './pages/dashboard/MiPerfil'

import EmpresaLayout from './layouts/EmpresaLayout'
import DashboardEmpresa from './pages/empresa/DashboardEmpresa'
import OfertasEmpresa from './pages/empresa/OfertasEmpresa'
import CandidatosEmpresa from './pages/empresa/CandidatosEmpresa'
import DocumentosEmpresa from './pages/empresa/DocumentosEmpresa'
import MensajesEmpresa from './pages/empresa/MensajesEmpresa'
import PerfilEmpresa from './pages/empresa/PerfilEmpresa'
import AdminLayout from './layouts/AdminLayout'
import PanelAdmin from './pages/admin/PanelAdmin'
import SoporteAdmin from './pages/admin/SoporteAdmin'
import UsuariosAdmin from './pages/admin/UsuariosAdmin'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/recuperar-password" element={<RecoverPassword />} />

      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Navigate to="explorar" replace />} />
        <Route path="explorar" element={<Explorar />} />
        <Route path="mensajes" element={<Mensajes />} />
        <Route path="documentos" element={<DocumentosSS />} />
        <Route path="perfil" element={<MiPerfil />} />
      </Route>
      {/* TODO BACKEND: proteger las rutas de empresa con sesión/rol reales y manejar acceso
          denegado o sesión expirada. La API debe validar la autorización en cada operación. */}
      <Route path="/empresa" element={<EmpresaLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardEmpresa />} />
        <Route path="ofertas" element={<OfertasEmpresa />} />
        <Route path="candidatos" element={<CandidatosEmpresa />} />
        <Route path="documentos" element={<DocumentosEmpresa />} />
        <Route path="mensajes" element={<MensajesEmpresa />} />
        <Route path="perfil" element={<PerfilEmpresa />} />
      </Route>
      {/* TODO BACKEND: proteger /admin con sesión y rol administrativo reales;
          validar permisos también en todos los endpoints, no solo en el router. */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<PanelAdmin />} />
        <Route path="soporte" element={<SoporteAdmin />} />
        <Route path="usuarios" element={<UsuariosAdmin />} />
      </Route>
    </Routes>
  )
}

export default App


import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import RecoverPassword from './pages/RecoverPassword'
import CompletarPerfil from './pages/CompletarPerfil'
import InvitarEquipo from './pages/InvitarEquipo'
import AceptarInvitacion from './pages/AceptarInvitacion'
import OnboardingGate from './components/login_register/OnboardingGate'

import DashboardLayout from './layouts/DashboardLayout'
import Explorar from './pages/estudiante/Explorar'
import Mensajes from './pages/estudiante/Mensajes'
import DocumentosSS from './pages/estudiante/DocumentosSS'
import MiPerfil from './pages/estudiante/MiPerfil'

import DashboardEmpresa from './pages/empresa/DashboardEmpresa'
import OfertasEmpresa from './pages/empresa/OfertasEmpresa'
import CandidatosEmpresa from './pages/empresa/CandidatosEmpresa'
import DocumentosEmpresa from './pages/empresa/DocumentosEmpresa'
import PerfilEmpresa from './pages/empresa/PerfilEmpresa'
import MiPerfilEmpresa from './pages/empresa/MiPerfilEmpresa'
import ReclutadoresEmpresa from './pages/empresa/ReclutadoresEmpresa'
import PanelAdmin from './pages/admin/PanelAdmin'
import SoporteAdmin from './pages/admin/SoporteAdmin'
import UsuariosAdmin from './pages/admin/UsuariosAdmin'
import PerfilAdmin from './pages/admin/PerfilAdmin'
import ProtectedRoute from './components/login_register/ProtectedRoute'
import PublicOnlyRoute from './components/login_register/PublicOnlyRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
      </Route>  
      
      <Route path="/recuperar-password" element={<RecoverPassword />} />

      {/* Pública y fuera de PublicOnlyRoute: si alguien con sesión abre el link,
          la página le explica que debe cerrar sesión (en vez de redirigirlo sin aviso). */}
      <Route path="/invitacion/:token" element={<AceptarInvitacion />} />


      <Route element={<ProtectedRoute roles={['student']} />}>
        {/* Fuera del dashboard: se ve como un paso más del registro. */}
        <Route path="/completar-perfil" element={<CompletarPerfil />} />

        <Route element={<OnboardingGate />}>
          <Route path="/dashboard" element={<DashboardLayout rol="student" />}>
            <Route index element={<Navigate to="explorar" replace />} />
            <Route path="explorar" element={<Explorar />} />
            <Route path="mensajes" element={<Mensajes />} />
            <Route path="documentos" element={<DocumentosSS />} />
            <Route path="perfil" element={<MiPerfil />} />
          </Route>
        </Route>
      </Route>
      {/* TODO BACKEND: proteger las rutas de empresa con sesión/rol reales y manejar acceso
          denegado o sesión expirada. La API debe validar la autorización en cada operación. */}
      <Route element={<ProtectedRoute roles={['company']} />}>
        {/* Fuera del dashboard, como "Completa tu perfil": solo el owner, una vez. */}
        <Route path="/invitar-equipo" element={<InvitarEquipo />} />

        <Route element={<OnboardingGate />}>
          <Route path="/empresa" element={<DashboardLayout rol="company" />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardEmpresa />} />
            <Route path="ofertas" element={<OfertasEmpresa />} />
            <Route path="candidatos" element={<CandidatosEmpresa />} />
            <Route path="documentos" element={<DocumentosEmpresa />} />
            <Route path="mensajes" element={<Mensajes className="empresa-mensajes" />} />
            <Route path="perfil" element={<PerfilEmpresa />} />
            <Route path="mi-perfil" element={<MiPerfilEmpresa />} />
            <Route path="reclutadores" element={<ReclutadoresEmpresa />} />
          </Route>
        </Route>
      </Route>
      {/* TODO BACKEND: proteger /admin con sesión y rol administrativo reales;
          validar permisos también en todos los endpoints, no solo en el router. */}
      <Route element={<ProtectedRoute roles={['admin']} />}>  
        <Route path="/admin" element={<DashboardLayout rol="admin" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<PanelAdmin />} />
          <Route path="soporte" element={<SoporteAdmin />} />
          <Route path="usuarios" element={<UsuariosAdmin />} />
          <Route path="perfil" element={<PerfilAdmin />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App


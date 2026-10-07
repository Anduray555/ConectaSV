
import { Logo } from "../Logo";
import { useNavigate } from "react-router-dom";

function Header() {

  const navigate = useNavigate()

  return (
    <header className="site-header">
      <Logo/>
        <div className="anchors">
            <a href="#caracteristicas">Características</a>  
            <a href="#estudiantes">Estudiantes</a>  
            <a href="#empresas">Empresas</a>  
            <a href="#servicio">Servicio Social</a>  
        </div>
        <div className="buttons_inicio">
            <button onClick={()=>navigate("/login")}>Iniciar sesión</button>
            <button onClick={()=>navigate("/registro")}>Registrarse gratis</button>
        </div>
    </header>
  );
}

export default Header;

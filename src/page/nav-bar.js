
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import OperationCard from './OperationCard';


function NavBar() {
  
  const navigate = useNavigate();

  const handleLogout = () => {
      // Effectuer les actions nécessaires avant la déconnexion, comme la suppression des données utilisateur
      navigate('/login'); // Rediriger vers la page de connexion
  };
  
  return (
    
    <nav>
      <h1>myBank</h1>
      <Link to="/" className="nav-link">🏠 Dashboard</Link>
      <Link to="/operation" className="nav-link"> 💳 Operations </Link>
      <Link to="/categories" className="nav-link">📂 Categories</Link>
      <Link to="/profile" className="nav-link">👤 Profile</Link>
      <button onClick={handleLogout} className="nav-link logout-btn">🔓 Logout</button>
    </nav>
  );
}
export default NavBar;
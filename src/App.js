import './css/App.css';
import NavBar from './page/nav-bar';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <header className="sidebar">
        <NavBar />
      </header>
      <main>
        <div className="content">
          <h2>Welcome to myBank</h2>
          {/* Ici React Router affichera le composant correspondant à la route */}
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default App;

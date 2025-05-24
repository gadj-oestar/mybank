import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8000/api/login', {
      username,
      password
    })
    .then(res => {
      console.log('Connexion réussie !');
      navigate('/'); // redirige vers ta page principale
    })
    .catch(err => {
      setError("Nom d'utilisateur ou mot de passe incorrect");
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">myBank</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="👤 Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="🔒 Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Se connecter</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <p className="login-footer">  <Link to="/signin"> Mot de passe oublié ?</Link></p>
      </div>
    </div>
  );
}

export default Login;

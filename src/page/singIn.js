import '../css/singIn.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Signin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("❌ Les mots de passe ne correspondent pas.");
      return;
    }

    axios.post('http://127.0.0.1:8000/api/register', {
      username: username,
      password: password
    })
    .then(res => {
      console.log(res.data);
      window.location.href = "/login"; // Redirection après succès
    })
    .catch(err => {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(`❌ ${err.response.data.message}`);
      } else {
        setError("❌ Erreur lors de l'inscription. Veuillez réessayer.");
      }
    });
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <h2 className="signin-title">Créer un compte myBank</h2>
        <form className="signin-form" onSubmit={handleSubmit}>
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
          <input
            type="password"
            placeholder="🔒 Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">S'inscrire</button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <p className="signin-footer">
          Déjà un compte ? <Link to="/login">Connectez-vous</Link>
        </p>
      </div>
    </div>
  );
}

export default Signin;

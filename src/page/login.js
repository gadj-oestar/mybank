import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Pour naviguer après connexion réussie
import '../css/Login.css'; // Styles CSS spécifiques à la page de connexion
import axios from 'axios'; // Librairie pour faire des requêtes HTTP
import { Link } from 'react-router-dom'; // Pour le lien vers la page "Mot de passe oublié"

function Login() {
  // State pour stocker le nom d'utilisateur saisi
  const [username, setUsername] = useState('');
  // State pour stocker le mot de passe saisi
  const [password, setPassword] = useState('');
  // Hook pour rediriger l'utilisateur après connexion
  const navigate = useNavigate();
  // State pour afficher un message d'erreur en cas d'échec de connexion
  const [error, setError] = useState('');

  // Fonction appelée lors de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    // Envoi d'une requête POST à l'API pour tenter de se connecter
    axios.post('http://127.0.0.1:8000/api/login', {
      username,
      password
    }, {
      withCredentials: true, // Pour inclure les cookies de session dans la requête
    })
    .then(res => {
      console.log('Connexion réussie !');
      navigate('/'); // Redirige vers la page principale après connexion
    })
    .catch(err => {
      // En cas d'erreur (ex : mauvais identifiants), on affiche un message d'erreur
      setError("Nom d'utilisateur ou mot de passe incorrect");
    });
  };

  // JSX pour afficher le formulaire de connexion
  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">myBank</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="👤 Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Mise à jour du username à chaque frappe
            required
          />
          <input
            type="password"
            placeholder="🔒 Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Mise à jour du password à chaque frappe
            required
          />
          <button type="submit">Se connecter</button>
        </form>

        {/* Affiche un message d'erreur si error n'est pas vide */}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* Lien vers la page "Mot de passe oublié" */}
        <p className="login-footer">
          <Link to="/signin">Mot de passe oublié ?</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

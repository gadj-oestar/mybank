import '../css/singIn.css'; // Import du fichier CSS pour le style de la page
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Pour les liens internes de navigation
import axios from 'axios'; // Pour les requêtes HTTP

function Signin() {
  // États locaux pour stocker les valeurs des champs du formulaire
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(''); // Pour afficher un message d'erreur

  // Fonction appelée à la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setError(''); // Réinitialise le message d'erreur

    // Vérification que les deux mots de passe correspondent
    if (password !== confirmPassword) {
      setError("❌ Les mots de passe ne correspondent pas.");
      return; // On stoppe la suite si les mots de passe ne sont pas identiques
    }

    // Envoi des données à l'API pour créer un nouvel utilisateur
    axios.post('http://127.0.0.1:8000/api/register', {
      username: username,
      password: password
    })
    .then(res => {
      // Succès : on peut afficher un message ou rediriger vers la page de login
      console.log(res.data);
      window.location.href = "/login"; // Redirection vers la page de connexion
    })
    .catch(err => {
      // En cas d'erreur, on affiche un message approprié
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        // Message d'erreur envoyé par l'API
        setError(`❌ ${err.response.data.message}`);
      } else {
        // Message générique si pas de message spécifique
        setError("❌ Erreur lors de l'inscription. Veuillez réessayer.");
      }
    });
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <h2 className="signin-title">Créer un compte myBank</h2>
        {/* Formulaire d'inscription */}
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

        {/* Affichage du message d'erreur si erreur présente */}
        {error && <p className="error-message">{error}</p>}

        {/* Lien vers la page de connexion */}
        <p className="signin-footer">
          Déjà un compte ? <Link to="/login">Connectez-vous</Link>
        </p>
      </div>
    </div>
  );
}

export default Signin;

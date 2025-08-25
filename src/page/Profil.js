import React, { useEffect, useState } from 'react';
import '../css/Profil.css';
import { Link } from 'react-router-dom';

function Profil() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch('http://127.0.0.1:8000/api/profil', {
    method: 'GET',
    headers: { Accept: 'application/json' },
  })
    .then(res => res.json())
    .then(data => {
      setUsername(data.username);
      setPassword(data.password); // récupère le mot de passe pour test
      setLoading(false);
    })
    .catch(() => {
      setMessage('Erreur lors du chargement du profil');
      setLoading(false);
    });
}, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');

    const payload = {};
    if (username) payload.username = username;
    if (password) payload.password = password;

    fetch('http://127.0.0.1:8000/api/profil', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors de la mise à jour');
        return res.json();
      })
      .then(data => {
        setMessage(data.message || 'Profil mis à jour avec succès');
        setPassword('');
      })
      .catch(() => {
        setMessage('Erreur lors de la mise à jour');
      });
  };

  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="profil-container">
      <h2>Profil utilisateur</h2>
      {message && <p className="message">{message}</p>}
      <form className="profil-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nom d’utilisateur :</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            className="input-text"
          />
        </div>
        <div className="form-group">
          <label>Nouveau mot de passe :</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Laisser vide pour ne pas changer"
            className="input-password"
          />
        </div>
        <button type="submit" className="btn-submit">Mettre à jour</button>
      </form>
            <Link to="/" className="btn-back">Retour</Link>
    </div>
  );
}

export default Profil;

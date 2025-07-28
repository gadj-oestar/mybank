import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Pour récupérer l'id dans l'URL et gérer la navigation
import '../css/EditOperation.css'; // Import du fichier CSS pour le style
import { Link } from 'react-router-dom'; // Pour le lien de retour


function OperationList() {
  // Récupère l'id de l'opération depuis l'URL (ex : /operation/123 => id = 123)
  const { id } = useParams();

  // Hook pour naviguer programmétiquement (rediriger après sauvegarde)
  const navigate = useNavigate();

  // State local pour stocker les infos de l'opération à éditer
  const [operation, setOperation] = useState({
    libelle: '',
    montant: '',
    categorie: '',
    date: ''
  });

  // useEffect pour charger les données de l'opération quand le composant est monté
  useEffect(() => {
    // Requête GET vers l'API pour récupérer l'opération selon l'id
    fetch(`http://localhost:8000/api/operations/${id}`)
      .then(res => res.json()) // On parse la réponse JSON
      .then(data => setOperation(data)) // On met à jour le state avec les données reçues
      .catch(err => console.error('Erreur chargement opération :', err)); // Gestion des erreurs
  }, [id]); // Se déclenche uniquement si l'id change

  // Fonction pour gérer les changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Mise à jour du state operation avec la nouvelle valeur du champ modifié
    setOperation({ ...operation, [name]: value });
  };

  // Fonction appelée lors de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    // Requête PUT vers l'API pour modifier l'opération
    fetch(`http://localhost:8000/api/operations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json', // On envoie des données JSON
      },
      body: JSON.stringify(operation), // On envoie les données modifiées
    })
      .then(() => navigate('/operation')) // Après succès, on redirige vers la liste des opérations
      .catch((err) => console.error('Erreur modification :', err)); // Gestion des erreurs
  };

  // JSX rendu : formulaire pour modifier l'opération
  return (
    <div className="edit-container">
      <h2>✏️ Modifier l'opération</h2>
      <form onSubmit={handleSubmit} className="edit-form">
        <label>Libellé</label>
        <input 
          type="text" 
          name="libelle" 
          value={operation.libelle} 
          onChange={handleChange} 
          required 
        />

        <label>Montant (€)</label>
        <input 
          type="number" 
          name="montant" 
          value={operation.montant} 
          onChange={handleChange} 
          required 
        />

        <label>Catégorie</label>
        <input 
          type="text" 
          name="categorie" 
          value={operation.categorie} 
          onChange={handleChange} 
          required 
        />

        <label>Date</label>
        <input 
          type="date" 
          name="date" 
          value={operation.date} 
          onChange={handleChange} 
          required 
        />

        <button type="submit" className="btn-update">
          💾 Enregistrer les modifications
        </button>
      </form>
      
      {/* Lien pour revenir à la page d'accueil */}
      <Link to="/" className="btn-back">Retour</Link>
    </div>
  );
}

export default OperationList;

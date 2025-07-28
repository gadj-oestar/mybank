import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Navigation et lien
import '../css/OperationCard.css'; // Styles CSS

function OperationCard() {
  // State qui contient la liste des opérations
  const [operation, setOperations] = useState([]);
  // Hook pour la navigation programmée
  const navigate = useNavigate();

  // useEffect pour charger les opérations au chargement du composant (une seule fois)
  useEffect(() => {
    fetch('http://localhost:8000/api/operations') // Requête GET vers l'API
      .then((response) => response.json()) // Transformation de la réponse en JSON
      .then((data) => setOperations(data)) // Mise à jour du state avec les opérations reçues
      .catch((error) => console.error('Erreur chargement opérations :', error)); // Gestion des erreurs
  }, []); // Tableau vide : s'exécute uniquement au montage

  // Fonction appelée quand on clique sur "Ajouter une opération"
  const handleAddClick = () => {
    navigate('/operation/new'); // Redirection vers la page de création d'une nouvelle opération
  };

  // Fonction appelée pour modifier une opération, reçoit son id
  const handleEdit = (id) => {
    navigate(`/operation/edit/${id}`); // Redirection vers la page d'édition de l'opération
  };

  // Fonction pour supprimer une opération par son id
  const handleDelete = (id) => {
    // Confirmation avant suppression
    if (window.confirm('Voulez-vous vraiment supprimer cette opération ?')) {
      fetch(`http://localhost:8000/api/operations/${id}`, {
        method: 'DELETE', // Requête DELETE à l'API
      })
        .then(() => {
          // Mise à jour du state en filtrant l'opération supprimée
          setOperations((prev) => prev.filter((op) => op.id !== id));
        })
        .catch((error) => console.error('Erreur suppression :', error)); // Gestion des erreurs
    }
  };

  // Rendu JSX construit avec React.createElement
  return React.createElement(
    'div',
    null,
    React.createElement(
      'div',
      { className: 'operation-container' },
      React.createElement('h2', { className: 'title' }, '📋 Gestion des opérations'),

      // Bouton pour ajouter une nouvelle opération
      React.createElement(
        'button',
        { className: 'btn-create', onClick: handleAddClick },
        '➕ Ajouter une opération'
      ),

      // Liste des opérations
      React.createElement(
        'div',
        { className: 'operation-list' },

        // Condition : si aucune opération, message d'info
        operation.length === 0
          ? React.createElement(
              'p',
              { className: 'no-op' },
              'Aucune opération à afficher pour le moment.'
            )
          : 
          // Sinon on mappe les opérations et on crée une "carte" pour chacune
          operation.map((op) =>
            React.createElement(
              'div',
              { key: op.id, className: 'operation-card' },
              React.createElement('h3', null, op.libelle),
              React.createElement('p', null, React.createElement('strong', null, 'Montant :'), ` ${op.montant} €`),
              React.createElement('p', null, React.createElement('strong', null, 'Catégorie :'), ` ${op.categorie}`),
              React.createElement('p', null, React.createElement('strong', null, 'Date :'), ` ${op.date}`),

              // Boutons d'action pour modifier ou supprimer
              React.createElement(
                'div',
                { className: 'card-actions' },
                React.createElement(
                  'button',
                  { className: 'btn-edit', onClick: () => handleEdit(op.id) },
                  '✏️ Modifier'
                ),
                React.createElement(
                  'button',
                  { className: 'btn-delete', onClick: () => handleDelete(op.id) },
                  '🗑️ Supprimer'
                )
              )
            )
          )
      ),

      // Lien pour revenir à l'accueil
      React.createElement(
        Link,
        { to: '/', className: 'btn-back' },
        'Retour'
      )
    )
  );
}

export default OperationCard;

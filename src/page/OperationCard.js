import React, { useEffect, useState } from 'react';
import '../css/OperationCard.css';
import { useNavigate } from 'react-router-dom';

function OperationCard() {
  const [operation, setOperations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/api/operations')
      .then((response) => response.json())
      .then((data) => setOperations(data))
      .catch((error) => console.error('Erreur chargement opérations :', error));
  }, []);

  const handleAddClick = () => {
    navigate('/operation/new');
  };

  const handleEdit = (id) => {
    navigate(`/operation/edit/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette opération ?')) {
      fetch(`http://localhost:8000/api/operations/${id}`, {
        method: 'DELETE',
      })
        .then(() => {
          setOperations((prev) => prev.filter((op) => op.id !== id));
        })
        .catch((error) => console.error('Erreur suppression :', error));
    }
  };

  return (
    <div className="operation-container">
      <h2 className="title">📋 Gestion des opérations</h2>

      <button className="btn-create" onClick={handleAddClick}>
        ➕ Ajouter une opération
      </button>

      <div className="operation-list">
        {operation.length === 0 ? (
          <p className="no-op">Aucune opération à afficher pour le moment.</p>
        ) : (
          operation.map((op) => (
            <div key={op.id} className="operation-card">
              <h3>{op.libelle}</h3>
              <p><strong>Montant :</strong> {op.montant} €</p>
              <p><strong>Catégorie :</strong> {op.categorie}</p>
              <p><strong>Date :</strong> {op.date}</p>
              <div className="card-actions">
                <button className="btn-edit" onClick={() => handleEdit(op.id)}>✏️ Modifier</button>
                <button className="btn-delete" onClick={() => handleDelete(op.id)}>🗑️ Supprimer</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default OperationCard;

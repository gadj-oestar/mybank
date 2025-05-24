import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/EditOperation.css';

function OperationList() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [operation, setOperation] = useState({
    libelle: '',
    montant: '',
    categorie: '',
    date: ''
  });

  useEffect(() => {
    fetch(`http://localhost:8000/api/operations/${id}`)
      .then(res => res.json())
      .then(data => setOperation(data))
      .catch(err => console.error('Erreur chargement opération :', err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOperation({ ...operation, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`http://localhost:8000/api/operations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(operation),
    })
      .then(() => navigate('/operations'))
      .catch((err) => console.error('Erreur modification :', err));
  };

  return (
    <div className="edit-container">
      <h2>✏️ Modifier l'opération</h2>
      <form onSubmit={handleSubmit} className="edit-form">
        <label>Libellé</label>
        <input type="text" name="libelle" value={operation.libelle} onChange={handleChange} required />

        <label>Montant (€)</label>
        <input type="number" name="montant" value={operation.montant} onChange={handleChange} required />

        <label>Catégorie</label>
        <input type="text" name="categorie" value={operation.categorie} onChange={handleChange} required />

        <label>Date</label>
        <input type="date" name="date" value={operation.date} onChange={handleChange} required />

        <button type="submit" className="btn-update">💾 Enregistrer les modifications</button>
      </form>
    </div>
  );
}

export default OperationList;

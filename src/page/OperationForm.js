import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../css/OperationForm.css'; // Assuming you have a CSS file for styling


function OperationForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    libelle: '',
    montant: '',
    date: '',
    categorie: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/operations', formData);
      navigate('/operation'); // Rediriger vers la liste des opérations après création
    } catch (err) {
      console.error('Erreur création opération', err.response?.data || err.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Nouvelle opération</h2>
      <form onSubmit={handleSubmit}>
        <input name="libelle" placeholder="Libellé" onChange={handleChange} required />
        <input name="montant" type="number" placeholder="Montant" onChange={handleChange} required />
        <input name="date" type="date" onChange={handleChange} required />
        <input name="categorie" placeholder="Catégorie" onChange={handleChange} required />
        <button type="submit">💾 Créer</button>
      </form>
      <Link to="/" className="btn-back">Retour</Link>
    </div>
  );
}

export default OperationForm;

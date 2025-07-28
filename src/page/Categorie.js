import React, { useEffect, useState } from 'react';
import '../css/Categories.css';
import { Link } from 'react-router-dom';


export default function CategorieList() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Erreur API :", err));
  }, []);

  return (
    <div>
      <h2>Liste des catégories utilisées</h2>
      <ul>
        {categories.map((cat, index) => (
          <li key={index}>{cat}</li>
        ))}
      </ul>
        <Link to="/" className="btn-back">Retour</Link>
    </div>
  );
}

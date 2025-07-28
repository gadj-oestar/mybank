import React, { useEffect, useState } from 'react';
import axios from 'axios';
import OperationCard from './OperationCard';
import '../css/Operations.css';

function Operations() {
  // State pour stocker la liste des opérations récupérées depuis l'API
  const [operations, setOperations] = useState([]);

  // Fonction asynchrone pour récupérer les opérations depuis l'API
  const fetchData = async () => {
    console.log('fetchData() appelé 🚀');
    try {
      // Requête GET avec axios vers l'API backend
      const res = await axios.get('http://127.0.0.1:8000/api/operations');
      console.log('Données reçues depuis l’API :', res.data);
      // Mise à jour du state avec les données reçues
      setOperations(res.data);
    } catch (error) {
      // En cas d'erreur, affichage dans la console
      console.error('Erreur lors du fetch des opérations :', error);
    }
  };

  // useEffect pour appeler fetchData au chargement du composant (une seule fois)
  useEffect(() => {
    fetchData();
  }, []);

  // Rendu du composant :
  // On crée un div qui contient un titre et une liste de OperationCard,
  // une carte par opération dans le tableau
  return React.createElement(
    'div',
    null,
    React.createElement('h2', null, 'Opérations bancaires'),
    // On mappe le tableau d’opérations et on crée un OperationCard pour chacune
    operations.map(op => {
      console.log('OPÉRATION :', op);
      return React.createElement(OperationCard, {
        key: op.id,        // clé unique pour React
        operation: op,     // on passe l’objet opération en prop
        refresh: fetchData // on passe la fonction de refresh pour recharger la liste après modif/suppression
      });
    })
  );
}

export default Operations;

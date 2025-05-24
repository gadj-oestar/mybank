import React, { useEffect, useState } from 'react';
import axios from 'axios';
import OperationCard from './OperationCard';

function Operations() {
  const [operations, setOperations] = useState([]);

  const fetchData = async () => {
     console.log('fetchData() appelé 🚀');
  try {
    const res = await axios.get('http://127.0.0.1:8000/api/operations');
    console.log('Données reçues depuis l’API :', res.data);
    setOperations(res.data);
  } catch (error) {
    console.error('Erreur lors du fetch des opérations :', error);
  }
};

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h2>Opérations bancaires</h2>
      {operations.map((op) => (
         console.log('OPÉRATION :', op),
        <OperationCard key={op.id} operation={op} refresh={fetchData} />
      ))}
      
    </div>
  );
}

export default Operations;

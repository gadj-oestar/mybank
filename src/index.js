import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Login from './page/login';
import Signin from './page/singIn';
import OperationCard from './page/OperationCard';
import OperationForm from './page/OperationForm';
import EditOperation from './page/EditOperation';
import Profile from './page/Profil';
import Categorie from './page/Categorie';
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/" element={<OperationCard />} />   
        <Route path="/operation" element={<OperationCard />} />
        <Route path="/operation/new" element={<OperationForm />} />
        <Route path="/operation/edit/:id" element={<EditOperation />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/categories" element={<Categorie />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

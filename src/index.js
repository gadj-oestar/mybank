import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './page/login';
import Signin from './page/singIn';
import OperationCard from './page/OperationCard';
import Operations from './page/Operations';
import OperationForm from './page/OperationForm';
import EditOperation from './page/EditOperation';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/operation" element={<OperationCard />} />
        <Route path="/operations" element={<Operations />} />
        <Route path="/operation/new" element={<OperationForm />} />
        <Route path="/operation/edit/:id" element={<EditOperation />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);


reportWebVitals();

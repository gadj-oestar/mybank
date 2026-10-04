import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Dashboard from './page/Dashboard';
import Operations from './page/Operations';
import OperationForm from './page/OperationForm';
import Categories from './page/Categories';
import Profile from './page/Profile';
import Login from './page/Login';
import Register from './page/Register';

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="operation" element={<Operations />} />
          <Route path="operation/new" element={<OperationForm />} />
          <Route path="operation/edit/:id" element={<OperationForm />} />
          <Route path="categories" element={<Categories />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<Register />} />
      </Routes>
      <Toaster position="bottom-right" toastOptions={{ className: 'toast' }} />
    </>
  );
}

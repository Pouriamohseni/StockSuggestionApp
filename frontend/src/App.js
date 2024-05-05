import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import './App.css';
import 'react-toastify/dist/ReactToastify.css';


import SignIn from './pages/SignIn';
import Navbar from './components/Navbar';
import SignUp from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ContactUsPage from './pages/ContactUsPage';
import LandingPage from './pages/LandingPage';
import StockGen from './pages/StockGen';
import SettingPage from './pages/SettingPage';
// import Footer from './components/Footer';

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/contactuspage" element={<ContactUsPage />} />
                <Route path="/stockgen" element={<StockGen />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/setting" element={<SettingPage />} />
            </Routes>
            <ToastContainer
                autoClose={2000}
                position="bottom-right"
            />
        </BrowserRouter>
    );
}

export default App;

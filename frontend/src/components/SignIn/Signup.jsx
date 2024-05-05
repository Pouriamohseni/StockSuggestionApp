import { useState } from 'react';
import axios from 'axios';
import { backendURL } from '../../utils';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
    });
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // form validation
        if (
            !formData.first_name ||
            !formData.last_name ||
            !formData.email ||
            !formData.password
        ) {
            console.error('Please fill in all fields.');
            return;
        }

        try {
            await axios.post(`${backendURL}/user/`, {
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                password: formData.password,
            });

            toast.success('Signed up successfully');
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (error) {
            toast.error('Something wrong happened');
        }
    };

    return (
        <form onSubmit={handleSubmit} className='sign-in-up-form'>
            <h1>Sign up</h1>
            <input
                type="text"
                name="first_name"
                placeholder="First name"
                value={formData.first_name}
                onChange={handleInputChange}
                className="inputField"
            />

            <input
                type="text"
                name="last_name"
                placeholder="Last name"
                value={formData.last_name}
                onChange={handleInputChange}
                className="inputField"
            />

            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="inputField"
            />

            <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="inputField"
            />

            <button type="submit">
                Create new account
            </button>

            <div className="register-link">
                <p>Already have an account? <a href="/">Sign in</a></p>
            </div>
        </form>
    );
};

export default Signup;

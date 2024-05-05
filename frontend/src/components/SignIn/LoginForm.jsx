import { useState } from 'react';
import axios from 'axios';
import { backendURL } from '../../utils';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import './LoginForm.css';

const LoginForm = () => {
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
    });
    const navigate = useNavigate();

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // form validation
        if (!credentials.username || !credentials.password) {
            console.error('Please fill in all fields.');
            return;
        }

        const url = `${backendURL}/user/?email=${credentials.username}&password=${credentials.password}`;
        try {
            const response = await axios.get(url);

            localStorage.setItem('token', response.data.access_token);
            toast.success('Signed in successfully');
            setTimeout(() => {
                navigate('/stockgen');
            }, 3000);
        } catch (error) {
            toast.error('Oops! Wrong sign in info');
        }
    };

    return (
        <form onSubmit={handleSubmit} className='sign-in-up-form'>
            <h1>Sign in</h1>
            <input
                className="inputField"
                type="text"
                placeholder="Username"
                name="username"
                value={credentials.username}
                onChange={handleInputChange}
                required
            />
            <input
                className="inputField"
                type="password"
                placeholder="Password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                required
            />
            <label>
                <input type="checkbox" />
                Remember me
            </label>
            <a href="#">Forgot Password?</a>

            <button className="submitButton" type="submit">
                Login
            </button>

            <div className="register-link">
                <p>Don&apos;t have an account? <a href="/signup">Signup</a></p>
            </div>
        </form>
    );
};

export default LoginForm;

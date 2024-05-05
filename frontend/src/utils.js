export const backendURL = process.env.REACT_APP_DEVELOPMENT ? 'http://localhost:8000' : 'https://stocks-backend.jeremynguyen.dev';
export const frontendURL = process.env.REACT_APP_DEVELOPMENT ? 'http://localhost:3000' : 'https://stocks-frontend.jeremynguyen.dev';

export function getAuthHeader() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/signin';
    }

    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    };

    return config;
}
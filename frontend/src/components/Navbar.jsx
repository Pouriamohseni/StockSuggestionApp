import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Navbar = () => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const handleLogOut = () => {
        localStorage.clear();
        navigate('/signin');
        toast.info('Logged out successfully');
    };

    return (
        <nav style={navStyle}>
            <div style={ulStyle}>
                <a href="/" style={linkStyle}>
                    Home
                </a>
                <a href="/dashboard" style={linkStyle}>
                    Dashboard
                </a>
                <a href="/stockgen" style={linkStyle}>
                    Suggestion engine
                </a>
                <a href="#" style={linkStyle}>
                    About
                </a>
                <a href="/ContactUsPage" style={linkStyle}>
                    Contact
                </a>
                {token ?
                    <a style={linkStyle} onClick={handleLogOut}>
                        Sign out
                    </a>
                    :
                    <a style={linkStyle} onClick={() => navigate('/signin')}>
                        Sign in
                    </a>
                }
            </div>
            {token && <a style={menuStyle} href="/setting">
                <span className="material-symbols-outlined">
                    menu
                </span>
            </a>}
        </nav>
    );
};

// Styles

const menuStyle = {
    position: 'absolute',
    right: '20px'
};

const navStyle = {
    background: 'var(--dark)',
    padding: '20px',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center'
};

const ulStyle = {
    padding: 0,
    margin: 0,
    display: 'flex',
    justifyContent: 'center',
    gap: '40px'
};

const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    padding: '0',
    cursor: 'pointer',
};

export default Navbar;

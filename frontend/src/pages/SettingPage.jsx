import { useEffect, useState } from 'react';
import axios from 'axios';
import { backendURL, getAuthHeader } from '../utils';
import { toast } from 'react-toastify';
import './SettingPage.css';

const SettingPage = () => {
    const [user, setUser] = useState(null);
    const [updateForm, setUpdateForm] = useState({
        first_name: '',
        last_name: '',
        password: '',
        confirmPassword: '',
        email: ''
    });

    const fetchUserData = async () => {
        const response = await axios.get(
            `${backendURL}/user_get_profile/`,
            getAuthHeader()
        );

        setUser(response.data);
        setUpdateForm(prev => {
            return { ...prev, ...response.data };
        });
    };

    const inputChange = (e) => {
        const val = e.target.value;
        const key = e.target.name;

        setUpdateForm(prev => {
            return { ...prev, ...{
                [key]: val
            } };
        });
    };

    const submitForm = async (e) => {
        e.preventDefault();

        if (updateForm.password.length < 5) {
            toast.error('Password is too short');
            return;
        }

        if (updateForm.confirmPassword != updateForm.password) {
            toast.error('Passwords don\'t match');
            return;
        }

        try {
            await axios.patch(
                `${backendURL}/user_edit_profile/`,
                updateForm,
                getAuthHeader()
            );

            toast.success('success');
            fetchUserData();
        } catch (err) {
            console.error(err);
            toast.error('Sumtin bad happened idk');
        }

    };

    useEffect(() => {
        fetchUserData();
    }, []);

    if (!user) {
        return (<></>);
    }

    return (
        <div className='setting-page-container'>
            <h3>{user.first_name} {user.last_name}</h3>
            <p>{user.email}</p>
            <form className='common-input' onSubmit={submitForm}>
                <h3>Update your account info</h3>
                <div className='update-name-field'>
                    <input
                        type='text'
                        placeholder='first name'
                        name='first_name'
                        value={updateForm.first_name}
                        onChange={inputChange}
                    />
                    <input
                        type='text'
                        placeholder='last name'
                        name='last_name'
                        value={updateForm.last_name}
                        onChange={inputChange}
                    />
                </div>

                <input
                    type='text'
                    placeholder='email'
                    name='email'
                    value={updateForm.email}
                    onChange={inputChange}
                />

                <input
                    type='password'
                    placeholder='password'
                    name='password'
                    value={updateForm.password}
                    onChange={inputChange}
                    required
                />

                <input
                    type='password'
                    placeholder='confirm password'
                    name='confirmPassword'
                    value={updateForm.confirmPassword}
                    onChange={inputChange}
                    required
                />

                <button className="submitButton" type="submit">
                    Update
                </button>
            </form>
        </div>
    );
};

export default SettingPage;

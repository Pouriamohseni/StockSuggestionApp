import { useState } from 'react';
import axios from 'axios';
import './ContactUs.css';

export default function ContactUs() {
    // Adjusted state to include separate fields for first name and last name
    const [emailData, setEmailData] = useState({
        first_name: '',
        last_name: '',
        user_email: '',
        subject: '',
        message: ''
    });

    // Update the state based on the user's input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEmailData({
            ...emailData,
            [name]: value
        });
    };

    const sendEmail = async (e) => {
        e.preventDefault();

        try {
            // Making a POST request to the backend using async/await
            // Define the endpoint URL for the backend service
            const endpoint = 'http://your-backend-endpoint.com/send-email';
            const response = await axios.post(endpoint, emailData);

            const data = await response.json();
            console.log('Success:', data);

            // Reset form data state to empty
            setEmailData({ first_name: '', last_name: '', user_email: '', subject: '', message: '' });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <section>
            <div>
                <form onSubmit={sendEmail} className="contact-us-form">
                    <h2>Contact Us</h2>
                    <p>Got a technical issue? Want to send feedback about a feature? Let us know.</p>
                    <div>
                        <div>
                            <label htmlFor="first_name">First Name</label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                value={emailData.first_name}
                                onChange={handleInputChange}
                                placeholder="Firstname"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="last_name">Last Name</label>
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                value={emailData.last_name}
                                onChange={handleInputChange}
                                placeholder="Lastname"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="user_email">Email</label>
                        <input
                            type="email"
                            id="user_email"
                            name="user_email"
                            value={emailData.user_email}
                            onChange={handleInputChange}
                            placeholder="name@company.com"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="subject">Subject</label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={emailData.subject}
                            onChange={handleInputChange}
                            placeholder="Let us know how we can help you"
                            required
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="message">Your message</label>
                        <textarea
                            id="message"
                            name="message"
                            rows="6"
                            value={emailData.message}
                            onChange={handleInputChange}
                            placeholder="Leave a comment..."
                        ></textarea>
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </section>
    );
}

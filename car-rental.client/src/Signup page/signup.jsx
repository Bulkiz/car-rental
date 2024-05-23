import { useEffect, useState } from 'react';
import carImage2 from './../assets/car2.png';
import './signup.css';

const Signup = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [role, setRole] = useState("");
    const [options, setOptions] = useState([]);
    const [roleId, setRoleId] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://localhost:7038/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, firstName, lastName, dateOfBirth, roleId })
            });

            if (response.ok) {
                const user = await response.json();
                props.setUser(user);
                props.setCurrentPage("MainPage")
            } else {
                console.error("Signup failed:", response.statusText);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await fetch('https://localhost:7038/roles');
                if (response.ok) {
                    const options = await response.json();
                    setOptions(options);
                } else {
                    console.error('Failed to fetch roles:', response.statusText);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        fetchRoles();
    }, [])

    const handleLoginClick = () => {
        props.setCurrentPage("Login");
    }

    const handleRoleSelect = (event) => {
        setRoleId(event.target.value);
    };

    return (
        <div className="signup-container">
            <div className='left-side-signup'>
                <h1>Register</h1>
                <h4>Enter your information to create an account.</h4>

                <div className="form-container">
                    <form onSubmit={handleSignup}>
                        <div className="input-container">
                            <input type="text" name="First Name" placeholder="First Name" onChange={(e) => setFirstName(e.target.value)} required />
                        </div>
                        <div className="input-container">
                            <input type="text" name="Last Name" placeholder="Last Name" onChange={(e) => setLastName(e.target.value)} required />
                        </div>
                        <div className="input-container">
                            <input type="email" name="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="input-container">
                            <input type="password" name="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div className="input-container">
                            <input type="date" name="Date Of Birth" onChange={(e) => setDateOfBirth(e.target.value)} required />
                        </div>
                        <div className="input-container">
                            <select id="dropdown" className="dropdown" value={roleId} onChange={handleRoleSelect} required>
                                <option value="">Select a role</option>
                                {options.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.roleName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="input-container">
                            <button className='signup-btn' width={300} height={50} type="submit">
                                Sign up
                            </button>
                        </div>
                    </form>
                </div>
                <div className="signup-forgot-password">
                    <button className="invis-btn-signup" onClick={handleLoginClick}>
                        Already have an account? Log in.
                    </button>
                </div>
            </div>

            <div className='right-side-signup'>
                <div className='green-panel'></div>
                <img src={carImage2} className="car-image-signup" />
            </div>
        </div>
    );

}

export default Signup;
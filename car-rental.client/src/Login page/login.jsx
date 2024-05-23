import { useState } from 'react';
import carImage from './../assets/car.png';
import './login.css';

const Login = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [failed, setFailed] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            setFailed(false);
            const response = await fetch('https://localhost:7038/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const user = await response.json();
                props.setUser(user);
                props.setCurrentPage("MainPage")
            } else {
                setFailed(true);
                console.error("Login failed:", response.statusText);
            }
        } catch (error) {
            console.error("Error:", error);
        }


    }

    const handleSignupClick = () => {
        props.setCurrentPage("Signup");
    }

    return (
        <div className="login-container">
            <div className='left-side'>
                <h1>Login</h1>
                <h4>Enter you credentials to log in to your account.</h4>

                <div className="form-container">
                    <form onSubmit={handleLogin}>
                        {failed && <p className='red' >INVALID CREDENTIALS!</p>}
                        <div className="input-container">
                            <input type="email" name="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="input-container">
                            <input type="password" name="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div className="input-container">
                            <button className='login-btn' width={300} height={50} type="submit">
                                Log in
                            </button>
                        </div>
                        
                    </form>
                </div>
                <div className="signup-forgot-password">
                    <button className="invis-btn" onClick={handleSignupClick}>
                        New member? Sign up.
                    </button>
                </div>
            </div>

            <div className='right-side'>
                <div className='blue-panel'></div>
                <img src={carImage} className="car-image" />

            </div>
        </div>
    );

}

export default Login;
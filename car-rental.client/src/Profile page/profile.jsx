import { useState } from 'react';
import './../CarProfile Page/carProfile.css';

const Profile = (props) => {
    const [isDisabled, setIsDisabled] = useState(true);

    const handleEdit = () => {
        setIsDisabled(false);
    }

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://localhost:7038/users/${props.user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(props.user)
            });

            if (response.ok) {
                const user = await response.json();
                props.setUser(user); 
                props.setOriginalUser(props.user);
                setIsDisabled(true);
            } else {
                console.error("Save failed:", response.statusText);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const handleCancel = () => {
        setIsDisabled(true)
        props.setUser(props.originalUser)
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        props.setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    };

    return (
        <div>
            {props.user ? (
                <div className="profile-container">
                    <div className="panels-container">
                        <div className="info">
                            <div className="info-panel">
                                <h3>User Details</h3>
                                <br></br>
                                <div className="edit-input">
                                    <p>First Name: </p>
                                    {props.user && <input type="text" name="firstName" value={props.user.firstName} onChange={handleChange} disabled={isDisabled} required />}
                                </div>

                                <div className="edit-input">
                                    <p>Last Name: </p>
                                    {props.user && <input type="text" name="lastName" value={props.user.lastName} onChange={handleChange} disabled={isDisabled} required />}
                                </div>

                                <div className="edit-input">
                                    <p>Email: </p>
                                    {props.user && <input type="email" name="email" value={props.user.email} onChange={handleChange} disabled={isDisabled} required />}
                                </div>

                                <div className="edit-input">
                                    <p>Password: </p>
                                    {props.user && <input type="text" name="password" value={props.user.password} onChange={handleChange} disabled={isDisabled} required />}
                                </div>

                                <div className="edit-input">
                                    <p>Date Of Birth: </p>
                                    {props.user && <input type="date" name="dateOfBirth" value={props.user.dateOfBirth} onChange={handleChange} disabled={isDisabled} required />}
                                </div>

                            </div>
                            <div className="car-profile-buttons">
                                {isDisabled && < button className="book-btn" onClick={handleEdit}>EDIT DETAILS</button>}
                                {!isDisabled && <button className="book-btn" onClick={handleSave}>SAVE</button>}
                                {!isDisabled && <button className="book-btn" onClick={handleCancel}>CANCEL</button>}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <p>No user details found.</p>
            )}
        </div>
    );
}

export default Profile;
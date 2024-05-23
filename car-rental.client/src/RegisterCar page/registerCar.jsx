import { useState, useRef } from 'react';
import './registerCar.css';

const RegisterCar = (props) => {
    const [car, setCar] = useState({
        make: '', model: '', picture: '', engineType: '', transmissionType: '', seats: '',
        doors: '', airConditioner: false, location: '', pricePerDay: '', userOwnerId: props.user.id
    });
    const [picture, setPicture] = useState(null);
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);

    const handleCancel = () => {
        props.setCurrentPage("MyCars");
    };

    const handleSave = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!car.make) newErrors.make = true;
        if (!car.model) newErrors.model = true;
        if (!car.engineType) newErrors.engineType = true;
        if (!car.transmissionType) newErrors.transmissionType = true;
        if (!car.seats) newErrors.seats = true;
        if (!car.doors) newErrors.doors = true;
        if (!car.location) newErrors.location = true;
        if (!car.pricePerDay) newErrors.pricePerDay = true;
        if (!picture) newErrors.picture = true;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});

        const formData = new FormData();
        formData.append('make', car.make);
        formData.append('model', car.model);
        formData.append('engineType', car.engineType);
        formData.append('transmissionType', car.transmissionType);
        formData.append('seats', car.seats);
        formData.append('doors', car.doors);
        formData.append('airConditioner', car.airConditioner);
        formData.append('location', car.location);
        formData.append('pricePerDay', car.pricePerDay);
        formData.append('userOwnerId', car.userOwnerId);
        if (picture) {
            formData.append('pictureFile', picture);
        }

        try {
            const response = await fetch('https://localhost:7038/cars', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const user = await response.json();
                props.setCurrentPage("MyCars");
            } else {
                console.error("Save failed:", response.statusText);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPicture(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setCar(prevCar => ({
                    ...prevCar,
                    picture: reader.result
                }));
                setErrors(prevErrors => ({
                    ...prevErrors,
                    picture: false
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCar(prevCar => ({
            ...prevCar,
            [name]: type === 'checkbox' ? checked : value
        }));
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: false
        }));
    };

    return (
        <div className="registerCar-container">
            <div>
                <h1>Register Car</h1>
                <div className="registerCar-img-container">
                    <img src={car.picture} alt="Car preview" />
                    <div className="upload-btn-container">
                        <button type="button" className="upload-btn" onClick={handleUploadClick}>UPLOAD PICTURE</button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="upload-input"
                            onChange={handleUpload}
                        />
                    </div>
                    {errors.picture && <p className="error-text">Picture is required</p>}
                </div>
                <div className="registerCar-profile-buttons">
                    <button className="registerCar-btn" onClick={handleSave}>SAVE</button>
                    <button className="registerCar-btn" onClick={handleCancel}>CANCEL</button>
                </div>
            </div>
            <div className="registerCar-info">
                <div className="registerCar-info-panel">
                    <h3>Enter Details</h3>
                    <div className={`registerCar-edit-input ${errors.model ? 'error' : ''}`}>
                        <input type="text" name="model" placeholder="Model" value={car.model} onChange={handleChange} />
                        {errors.model && <p className="error-text">Model is required</p>}
                    </div>

                    <div className={`registerCar-edit-input ${errors.make ? 'error' : ''}`}>
                        <input type="text" name="make" placeholder="Make" value={car.make} onChange={handleChange} />
                        {errors.make && <p className="error-text">Make is required</p>}
                    </div>

                    <div className={`registerCar-edit-input ${errors.engineType ? 'error' : ''}`}>
                        <input type="text" name="engineType" placeholder="Engine Type" value={car.engineType} onChange={handleChange} />
                        {errors.engineType && <p className="error-text">Engine Type is required</p>}
                    </div>

                    <div className={`registerCar-edit-input ${errors.transmissionType ? 'error' : ''}`}>
                        <input type="text" name="transmissionType" placeholder="Transmission Type" value={car.transmissionType} onChange={handleChange} />
                        {errors.transmissionType && <p className="error-text">Transmission Type is required</p>}
                    </div>

                    <div className={`registerCar-edit-input ${errors.seats ? 'error' : ''}`}>
                        <input type="number" name="seats" placeholder="Seats" value={car.seats} onChange={handleChange} />
                        {errors.seats && <p className="error-text">Seats is required</p>}
                    </div>

                    <div className={`registerCar-edit-input ${errors.doors ? 'error' : ''}`}>
                        <input type="number" name="doors" placeholder="Doors" value={car.doors} onChange={handleChange} />
                        {errors.doors && <p className="error-text">Doors is required</p>}
                    </div>

                    <div className={`registerCar-edit-input airConditioner ${errors.airConditioner ? 'error' : ''}`}>
                        <p>Is air conditioner available?</p>
                        <input type="checkbox" name="airConditioner" checked={car.airConditioner} onChange={handleChange} />
                    </div>

                    <div className={`registerCar-edit-input ${errors.location ? 'error' : ''}`}>
                        <input type="text" name="location" placeholder="Location" value={car.location} onChange={handleChange} />
                        {errors.location && <p className="error-text">Location is required</p>}
                    </div>

                    <div className={`registerCar-edit-input ${errors.pricePerDay ? 'error' : ''}`}>
                        <input type="number" name="pricePerDay" placeholder="Price Per Day in BGN" value={car.pricePerDay} onChange={handleChange} />
                        {errors.pricePerDay && <p className="error-text">Price Per Day is required</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterCar;

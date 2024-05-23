import { useState, useEffect } from 'react';
import './carProfile.css';

const CarProfile = (props) => {
    const [car, setCar] = useState();
    const [originalCar, setOriginalCar] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDisabled, setIsDisabled] = useState(true);
    
    useEffect(() => {
        const fetchCarDetails = async () => {
            try {
                const response = await fetch(`https://localhost:7038/cars/${props.currentCarId}`);
                if (response.ok) {
                    const car = await response.json();
                    setCar(car);
                    setOriginalCar(car);
                } else {
                    console.error('Failed to fetch cars:', response.statusText);
                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCarDetails();
    }, []);

    useEffect(() => {
        if (props.role === 'renter') {
            setIsDisabled(true);
        }
    }, [props.role])

    const handleBookNow = async () => {
        try {

            const reservation = {
                userReservingId: props.user.id,
                startDate: props.pickupDate,
                endDate: props.returnDate,
                carId: props.currentCarId,
                price: props.totalPrice
            };

            const response = await fetch('https://localhost:7038/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reservation)
            });

            if (response.ok) {
                props.setCurrentPage("MyReservations")
            } else {
                response.body;
                setFailed(true);
                console.error("Reservation failed:", response.statusText);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const handleEdit = () => {
        setIsDisabled(false);
    }

    const handleRemove = async () => {
        try {
            const response = await fetch(`https://localhost:7038/cars/${props.currentCarId}/remove`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (response.ok) {
                props.setCurrentPage("MyCars")
            } else {
                console.error("Delete car failed:", response.statusText);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append('id', car.id);
        formData.append('make', car.make);
        formData.append('model', car.model);
        formData.append('engineType', car.engineType);
        formData.append('transmissionType', car.transmissionType);
        formData.append('seats', car.seats);
        formData.append('doors', car.doors);
        formData.append('airConditioner', car.airConditioner);
        formData.append('userOwnerId', car.userOwnerId);
        formData.append('pricePerDay', car.pricePerDay);
        formData.append('location', car.location);
        formData.append('insertDate', car.insertDate);
        formData.append('pictureFile', car.pic)

        try {
            const response = await fetch(`https://localhost:7038/cars/${props.currentCarId}`, {
                method: 'PUT',
                body: formData
            });

            if (response.ok) {
                const updatedCar = await response.json();
                updatedCar.pictureBase64 = updatedCar.picture;
                setOriginalCar(updatedCar);
                setCar(updatedCar);
                setIsDisabled(true);
            } else {
                console.error("Edit car failed:", response.statusText);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleCancel = () => {
        setIsDisabled(true)
        setCar(originalCar)
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCar(prevCar => ({
            ...prevCar,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
             {car ? (
            <div className="carProfile-container">
                <div className="panels-container">
                    <div>
                            <h1>{car.make} {car.model}</h1>
                            <div className="car-img-container">
                                {car.pictureBase64 && (
                                    <img src={`data:image/jpeg;base64,${car.pictureBase64}`} alt="Car" />
                                )}
                            </div>
                        <div className="car-profile-buttons">
                             {(props.role.roleName === 'Admin' || props.role.roleName === 'Renter') && <button className="book-btn" onClick={handleBookNow}>BOOK NOW</button>}
                             {(props.role.roleName === 'Admin' || props.role.roleName === 'Lessor') && <button className="book-btn" onClick={handleRemove}>REMOVE CAR</button>}
                             {isDisabled && (props.role.roleName === 'Admin' || props.role.roleName === 'Lessor') && <button className="book-btn" onClick={handleEdit}>EDIT DETAILS</button>}
                        </div>
                        
                    </div>
                    <div className="info">
                        <div className="info-panel">
                            <h3>Car Information</h3>
                            <br></br>
                            <div className="edit-input">
                                <p>Engine Type: </p>
                                {car && <input type="text" name="engineType" value={car.engineType} onChange={handleChange} disabled={isDisabled} required/>}
                            </div>

                            <div className="edit-input">
                                <p>Transmission Type: </p>
                                {car && <input type="text" name="transmissionType" value={car.transmissionType} onChange={handleChange} disabled={isDisabled} required/>}
                            </div>

                            <div className="edit-input">
                                <p>Seats: </p>
                                {car && <input type="number" name="seats" value={car.seats} onChange={handleChange} disabled={isDisabled} required/>}
                            </div>

                            <div className="edit-input">
                                <p>Doors: </p>
                                {car && <input type="number" name="doors" value={car.doors} onChange={handleChange} disabled={isDisabled} required/>}
                            </div>

                            <div className="edit-input">
                                <p>Air Conditioner: </p>
                                {car && <input type="checkbox" name="airConditioner" checked={car.airConditioner} onChange={handleChange} disabled={isDisabled} required/>}
                            </div>

                            <div className="edit-input">
                                <p>Location: </p>
                                {car && <input type="text" name="location" value={car.location} onChange={handleChange} disabled={isDisabled} required/>}
                            </div>

                            <div className="edit-input">
                                <p>Price Per Day in BGN: </p>
                                {car && <input type="number" name="pricePerDay" value={car.pricePerDay} onChange={handleChange} disabled={isDisabled} required/>}
                            </div>
                        </div>
                        <div className="car-profile-buttons">
                            {!isDisabled && <button className="book-btn" onClick={handleSave}>SAVE</button>}
                            {!isDisabled && <button className="book-btn" onClick={handleCancel}>CANCEL</button>}
                        </div>
                    </div>
                </div>
            </div>
            ) : (
                <p>No car details found.</p>
            )}
        </div>
    );
}

export default CarProfile;
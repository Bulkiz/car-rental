import { useEffect, useState } from 'react';
import carImage from './../assets/cars.png';
import './main-page.css';

const MainPage = (props) => {
    const [location, setLocation] = useState('');
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setCars([]);
    }, [props.pickupDate, props.returnDate])

    const onSearchClick = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://localhost:7038/cars?startDate=${props.pickupDate}&endDate=${props.returnDate}&location=${location}`);
            if (!response.ok) { 
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setCars(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="main-container">
           
            <main className="main-content">
                <div className="text-section">
                    <h1>Rent your favorite car in <span className="highlight">Easy</span> steps.</h1>
                    <p>Get a car wherever and whenever you need it.</p>
                </div>
                <div className="car-background">
                    <img src={carImage} />
                </div>
            </main>

            <div className="search-section">
                <div className="input-group">
                    <label htmlFor="location">Location</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        placeholder="Search your location..."
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group borderLeft">
                    <label htmlFor="pickup-date">Pickup Date</label>
                    <input
                        type="date"
                        id="pickup-date"
                        name="pickup-date"
                        value={props.pickupDate}
                        onChange={(e) => props.setPickupDate(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group borderLeft">
                    <label htmlFor="return-date">Return Date</label>
                    <input
                        type="date"
                        id="return-date"
                        name="return-date"
                        value={props.returnDate}
                        onChange={(e) => props.setReturnDate(e.target.value)}
                        required
                    />
                </div>
                <div className="search-btn-container">
                    <button className="search-button" onClick={onSearchClick}>Search</button>
                </div>
            </div>

            {cars ? (
                <div className="search-result">
                    {loading && <p>Loading...</p>}
                    {error && <p>Error: {error}</p>}
                    <div className="car-results">
                        {cars.map((car) => (
                            <div key={car.id} className="car-panel" onClick={() => props.handleCarClick(car.id)}>
                                    {car.picture && (
                                        <img src={`data:image/jpeg;base64,${car.picture}`} alt="Car" />
                                    )}
                                <h2>{car.model} {car.make}</h2>
                                <p>Price: BGN{props.calculateTotalPrice(car.pricePerDay)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p>No cars found.</p>
            )}
        </div>
    );
}

export default MainPage;
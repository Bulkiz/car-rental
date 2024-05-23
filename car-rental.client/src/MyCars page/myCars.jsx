import { useEffect, useState } from 'react';
import './myCars.css';

const MyCars = (props) => {

    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleAddCar = () => {
        props.setCurrentPage("RegisterCar")
    }

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await fetch(`https://localhost:7038/cars/user/${props.user.id}`);
                if (response.ok) {
                    const cars = await response.json();
                    setCars(cars);
                } else {
                    console.error('Failed to fetch cars:', response.statusText);
                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCars();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className='cars-container'>
            <h2>My Cars</h2>
            <table>
                <thead>
                    <tr>
                        <th>Car Name</th>
                        <th>Location</th>
                        <th>Price in BGN</th>
                        <th>Insert Date</th>
                    </tr>
                </thead>
                <tbody>
                    {cars.map((car) => (
                        <tr key={car.id} onClick={() => props.handleCarClick(car.id)}>
                            <td>{car.make} {car.model}</td>
                            <td>{car.location}</td>
                            <td>{car.pricePerDay}</td>
                            <td>{car.insertDate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="registerCar-btn" onClick={handleAddCar}>ADD NEW CAR</button>
        </div>
    );
};

export default MyCars;
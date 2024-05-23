import { useEffect, useState } from 'react';
import './myReservations.css';

const MyReservations = (props) => {

    const [currentReservations, setCurrentReservations] = useState([]);
    const [pastReservations, setPastReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const responseCurrent = await fetch(`https://localhost:7038/reservations/${props.user.id}/current`);
            if (responseCurrent.ok) {
                const reservations = await responseCurrent.json();
                setCurrentReservations(reservations);
            } else {
                console.error('Failed to fetch reservations current:', responseCurrent.statusText);
            }
            const responsePast = await fetch(`https://localhost:7038/reservations/${props.user.id}/past`);
            if (responsePast.ok) {
                const reservations = await responsePast.json();
                setPastReservations(reservations);
            } else {
                console.error('Failed to fetch reservations past:', responsePast.statusText); 
            }
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`https://localhost:7038/reservations/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (response.ok) {
                props.setCurrentPage("MyReservations")
            } else {
                console.error("Delete reservations failed:", response.statusText);
                setError("Cannot delete a reservation that is currently in process.");
            }
        } catch (err) {
            setError(err);
        }
        fetchReservations();
    }

    if (loading) return <div>Loading...</div>;

    return (
        <div className='reservations-container'>
            <h2>Current Reservations</h2>
            <table>
                <thead>
                    <tr>
                        <th>Car Name</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Price in BGN</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {currentReservations.map(reservation => (
                        <tr key={reservation.reservation.id}>
                            <td>{reservation.car.make} {reservation.car.model}</td>
                            <td>{reservation.reservation.startDate}</td>
                            <td>{reservation.reservation.endDate}</td>
                            <td>{reservation.reservation.price}</td>
                            <td>
                                <button
                                    className="delete-button"
                                    onClick={() => handleDelete(reservation.reservation.id)}>
                                    X
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {error && <p>{error}</p>}
            <h2>Past Reservations</h2>
            <table>
                <thead>
                    <tr>
                        <th>Car Name</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Price in BGN</th>
                    </tr>
                </thead>
                <tbody>
                    {pastReservations.map(reservation => (
                        <tr key={reservation.reservation.id}>
                            <td>{reservation.car.make} {reservation.car.model}</td>
                            <td>{reservation.reservation.startDate}</td>
                            <td>{reservation.reservation.endDate}</td>
                            <td>{reservation.reservation.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MyReservations;
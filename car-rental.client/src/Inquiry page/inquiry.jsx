import { useEffect, useState } from 'react';
import './inquiry.css';

const Inquiry = () => {
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();

    const onUsersClick = () => {
        fetch(`https://localhost:7038/inquiry/users?startDate=${startDate}&endDate=${endDate}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.blob();
            })
            .then(blob => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;

                const fileName = `lessors_registered_${startDate}_${endDate}.xlsx`;
                link.setAttribute('download', fileName);

                document.body.appendChild(link);
                link.click();

                link.parentNode.removeChild(link);
            })
            .catch(error => {
                console.error('Error downloading the file', error);
            });
    }

    const onCarsClick = () => {
        fetch(`https://localhost:7038/inquiry/cars?startDate=${startDate}&endDate=${endDate}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.blob();
            })
            .then(blob => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;

                const fileName = `cars_registered_${startDate}_${endDate}.xlsx`;
                link.setAttribute('download', fileName);

                document.body.appendChild(link);
                link.click();

                link.parentNode.removeChild(link);
            })
            .catch(error => {
                console.error('Error downloading the file', error);
            });
    }
 
    return (
        <div className='inquiry-container'>
            <div className="inquiry-section">
                
                <div className="inquiry-group borderLeft">
                    <label htmlFor="start-date">Start Date</label>
                    <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                </div>
                <div className="inquiry-group borderLeft">
                    <label htmlFor="end-date">End Date</label>
                    <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                    />
                </div>
                <div className="inquiry-btn-container">
                    <div className="space">
                        <button className="inquiry-button" onClick={onUsersClick}>Inquiry for registered users</button>
                    </div>
                    <div className="space">
                        <button className="inquiry-button" onClick={onCarsClick}>Inquiry for registered cars</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Inquiry;
import { useEffect, useState } from 'react';
import Login from './Login page/login.jsx';
import Signup from './Signup page/signup.jsx';
import MainPage from './Main page/main-page.jsx';
import CarProfile from './CarProfile Page/carProfile.jsx';
import Profile from './Profile page/profile.jsx';
import MyReservations from './MyReservations page/myReservations.jsx';
import MyCars from './MyCars page/myCars.jsx';
import Inquiry from './Inquiry page/inquiry.jsx';
import RegisterCar from './RegisterCar page/registerCar.jsx';
import logo from './assets/logo.png';
import './App.css';

function App() {
    const [currentPage, setCurrentPage] = useState("Login");
    const [isLoggedIn, setIsLoggedIn] = useState(false); 
    const [user, setUser] = useState(); 
    const [originalUser, setOriginalUser] = useState();
    const [pickupDate, setPickupDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [role, setRole] = useState([]);
    const [currentCarId, setCurrentCarId] = useState(null);
    const [totalPrice, setTotalPrice] = useState();

    useEffect(() => {
        if (user) {
            setIsLoggedIn(true)
            const fetchRole = async () => {
                try {
                    const response = await fetch(`https://localhost:7038/roles/${user.roleId}`);
                    if (response.ok) {
                        const role = await response.json();
                        setRole(role);
                    } else {
                        console.error('Failed to fetch role:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }
            fetchRole();
        } else {
            setIsLoggedIn(false)
        }
    }, [user]);

    const handleCarClick = (carId) => {
        setCurrentCarId(carId);
        setCurrentPage("CarProfile");
    };

    const onLogoutClick = () => {
        setIsLoggedIn(false);
        setUser(null);
        setOriginalUser(null);
        setRole(null);
        setCurrentPage("Login");
    }

    const onSearchCLick = () => {
        setCurrentPage("MainPage")
    }

    const onProfileCLick = () => {
        setCurrentPage("Profile")
    }

    const onReservationsCLick = () => {
        setCurrentPage("MyReservations")
    }

    const onCarsCLick = () => {
        setCurrentPage("MyCars")
    }

    const onInquiryCLick = () => {
        setCurrentPage("Inquiry")
    }

    const calculateNumberOfDays = () => {
        const startDate = new Date(pickupDate);
        const endDate = new Date(returnDate);
        const timeDifference = endDate.getTime() - startDate.getTime();
        const daysDifference = timeDifference / (1000 * 3600 * 24);
        return daysDifference;
    }

    const calculateTotalPrice = (pricePerDay) => {
        const numberOfDays = calculateNumberOfDays();
        if (isNaN(pricePerDay)) {
            setTotalPrice(0);
            return 0;
        }
        setTotalPrice(pricePerDay * numberOfDays);
        return pricePerDay * numberOfDays;
        
    }

    const renderHeader = () => {
        return (
            <header className="header">
                <div className="logo">
                    <img src={logo} />
                </div>
                <div className="nav">
                    <button className='nav-btn' onClick={onSearchCLick}>SEARCH</button>
                    <button className='nav-btn' onClick={onProfileCLick}>PROFILE</button>
                    <button className='nav-btn' onClick={onReservationsCLick}>MY RESERVATIONS</button>
                    {role ? (role.roleName === 'Lessor' && <button className='nav-btn' onClick={onCarsCLick}>MY CARS</button>) : (<p>no role</p>)}
                    {role ? (role.roleName === 'Admin' && <button className='nav-btn' onClick={onInquiryCLick}>INQUIRIES</button>) : (<p>no role</p>)}
                    <button className='nav-btn' onClick={onLogoutClick}>LOGOUT</button>
                </div>
            </header>
        );
    }

    const getContent = () => {
        switch (currentPage) {
            case "Login":
                return <Login
                    setCurrentPage={setCurrentPage}
                    setUser={setUser}
                    setOriginalUser={setOriginalUser }/>
            case "Signup":
                return <Signup
                    setCurrentPage={setCurrentPage}
                    setUser={setUser}
                    setOriginalUser={setOriginalUser}/>
            case "MainPage":
                return <MainPage
                    setCurrentPage={setCurrentPage}
                    pickupDate={pickupDate}
                    returnDate={returnDate}
                    setPickupDate={setPickupDate}
                    setReturnDate={setReturnDate}
                    handleCarClick={handleCarClick}
                    calculateTotalPrice={calculateTotalPrice} />
            case "Profile":
                return <Profile
                    setCurrentPage={setCurrentPage}
                    user={user}
                    setUser={setUser}
                    originalUser={originalUser}
                    setOriginalUser={setOriginalUser} />
            case "MyReservations":
                return <MyReservations
                    setCurrentPage={setCurrentPage}
                    user={user}
                    role={role} />
            case "MyCars":
                return <MyCars
                    setCurrentPage={setCurrentPage}
                    user={user}
                    handleCarClick={handleCarClick} />
            case "CarProfile":
                return <CarProfile
                    setCurrentPage={setCurrentPage}
                    role={role}
                    currentCarId={currentCarId}
                    user={user}
                    setUser={setUser}
                    pickupDate={pickupDate}
                    returnDate={returnDate}
                    totalPrice={totalPrice} />
            case "RegisterCar":
                return <RegisterCar
                    setCurrentPage={setCurrentPage}
                    user={user} />
            case "Inquiry":
                return <Inquiry />
               
        }
    };

    return (
        <div className="content">
            {isLoggedIn ? renderHeader() : null}
            {getContent()}
        </div>
    );

}

export default App;
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import "./navbar.css"
import Cookies from "js-cookie";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const Navbar = () => {

    const [openMenu, setOpenMenu] = useState(false);
    const [isLogged, setIsLogged] = useState(!!Cookies.get("userLogin"));
    const { data, loading, error } = useFetch(`http://localhost:8090/api/user/getUserById/${Cookies.get("userLogin")}`);
    const navigate = useNavigate();

    const handleLogIn = () => {
        navigate("/login");
    }

    const handleRegister = () => {
        navigate("/register");
    }

    const handleLogOut = () => {
        Cookies.remove("userLogin");
        Cookies.remove("adminUser");
        setIsLogged(false);
    }

    const handleDelete = async () => {
        try {
            console.log(data);
            console.log(data.idUser);
            await axios.delete(`http://localhost:8090/api/user/deleteUserById/${data.idUser}`);
            Cookies.remove("userLogin");
            Cookies.remove("adminUser");
            setIsLogged(false);
        } catch (err) {
            console.log("error:", err);
        }
    }

    const handleLogoClick = () => {
        navigate("/");
    }

    return (
        <div className="navbar">
            <div className="navContainer">
                <span className="logo" onClick={handleLogoClick}>Licenta Booking</span>
                <div className="navItems">
                    {isLogged ? (<>
                        <span>{data.userName}</span>
                        <FontAwesomeIcon icon={faBars} onClick={() => setOpenMenu(!openMenu)} className="menuIcon" />
                        {openMenu &&
                            <div className="navMenu">
                                <span>My Reservations</span>
                                <span onClick={handleLogOut}>Log Out</span>
                                {Cookies.get("adminUser") === "true" ? (<span>Mannage resources</span>):null} 
                                <span onClick={handleDelete} className="deleteAcc">Delete Account</span>
                            </div>}
                    </>) : (
                        <>
                            <button className="navButton" onClick={handleRegister}>Register</button>
                            <button className="navButton" onClick={handleLogIn}>Log In</button>
                        </>)}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

import "./register.css"
import useFetch from "../../hooks/useFetch";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";

const Register = () => {
    const [userName, setUserName] = useState<string>();
    const [userEmail, setUserEmail] = useState<string>();
    const [userPassword, setUserPassword] = useState<string>();
    const navigate = useNavigate();

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserName(e.target.value);
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserEmail(e.target.value);
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserPassword(e.target.value);
    }

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        try {
            const savedUser = await axios.post("http://localhost:8090/api/user/saveUser", { userName, userEmail, userPassword });

            console.log(savedUser.data.userEmail);
            
            axios.get(`http://localhost:8090/api/user/getUserByEmail/${savedUser.data.userEmail}`)
                .then(response => {
                    const user = response.data;
                    Cookies.set('userLogin', user.idUser);
                    Cookies.set('adminUser', user.isAdmin);
                    navigate("/");
                    console.log(user);
                })
                .catch(error => {
                    console.log(error);
                });
        } catch(err) {
            console.log(err);
        }
    }

    const handleLogIn = () =>{
        navigate("/login");
    }

    return (
        <div className="register">
            <div className="registerContainer">
                <input type="text" placeholder="username" onChange={handleNameChange} />
                <input type="text" placeholder="email" onChange={handleEmailChange}/>
                <input type="password" placeholder="password" onChange={handlePasswordChange}/>
                <button onClick={handleClick}>Create account</button>
                <p>Do you already have an account? <span onClick={handleLogIn}>Log In!</span></p>
            </div>
        </div>
    );
};

export default Register;
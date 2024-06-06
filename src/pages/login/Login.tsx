import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

import "./login.css";

const Login = () => {
    const [userEmail, setUserEmail] = useState<string>();
    const [userPassword, setUserPassword] = useState<string>();
    const [error, setError] = useState<string>();
    const navigate = useNavigate();

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserEmail(e.target.value);
    }

    const handlePasswordChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setUserPassword(e.target.value);
    }

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>{
        e.preventDefault();

        try{
           const user =  await axios.post("http://localhost:8090/api/user/login",{email: userEmail, password: userPassword});
           Cookies.set('userLogin', user.data.idUser);
           Cookies.set('adminUser', user.data.isAdmin);
           navigate("/");
        }catch(err: any){
            if(err.response){
                setError(err.response.data);
            }
            else if(err.request){
                setError("No response received from server");
            }
            else{
                setError("Error occurred while sending request");
            }
        }
    }

    const handleRegister = () => {
        navigate("/register");
    }

    return(
        <div className="login">
            <div className="loginContainer">
                <input type="text" placeholder="email" onChange={handleEmailChange}/>
                <input type="password" placeholder="password" onChange={handlePasswordChange}/>
                <button onClick={handleClick}>Log In</button>
                <p>Don't have an account? <span onClick={handleRegister}>Sign Up!</span></p>
                {error && <p className="error">{error}</p>}
            </div>
        </div>
    );
}

export default Login;
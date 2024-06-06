import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";

import "../../components/header/header.css";
import "../../components/navbar/navbar.css";
import "./hotel.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowLeft, faCircleArrowRight, faCircleXmark, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import useFetch from "../../hooks/useFetch";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import Cookies from "js-cookie";
import Footer from "../../components/footer/Footer";
import RoomMenu from "../../components/roomMenu/RoomMenu";

const Hotel = () => {

    const { id } = useParams<{ id: string }>();
    const { data, loading, error } = useFetch(`http://localhost:8091/api/photos/getAllByHotelId/${id}`);
    const { data: hotel, loading: loadingHotel, error: hotelError } = useFetch(`http://localhost:8091/api/hotel/getHotel/${id}`);
    const [slider, setSlider] = useState<number>(0);
    const [openSlider, setOpenSlider] = useState(false);
    const [openRoomMenu, setOpenRoomMenu] = useState(false);
    const [hotelResponse, setHotelResponse] = useState<string>();

    const navigate = useNavigate();

    const dateCookie = Cookies.get("date");
    const date = dateCookie ? JSON.parse(dateCookie) : [];

    const optionsCookie = Cookies.get("options");
    const options = optionsCookie ? JSON.parse(optionsCookie) : {};

    console.log(options.adults);
    console.log(options.children);
    console.log(date.startDate);
    console.log(date.endDate);

    const handleSlider = (index: number) => {
        setSlider(index);
        setOpenSlider(true);
    }

    const handleSlide = (direction: string) => {
        let newSlideNumber;

        if (direction === "left") {
            newSlideNumber = slider === 0 ? data.length - 1 : slider - 1;
        } else {
            newSlideNumber = slider === data.length - 1 ? 0 : slider + 1;
        }

        setSlider(newSlideNumber);
    }

    const handleBooking = () => {
        console.log(Cookies.get('userLogin'));
        if(Cookies.get('userLogin')){
            setOpenRoomMenu(true);
        } else {
            navigate("/login");
        }
    }

    return (
        <div>
            <Navbar />
            <Header type="list"/>
            {loadingHotel ? (<p>Loading hotel...</p>) : (
                <div className="hotelContainer">
                    {openSlider && <div className="slider">
                        <FontAwesomeIcon icon={faCircleXmark} onClick={() => { setOpenSlider(false) }} className="close" />
                        <FontAwesomeIcon icon={faCircleArrowLeft} onClick={() => handleSlide("left")} className="arrow" />
                        <div className="sliderWrapper">
                            <img src={data[slider].urlPhoto} />
                        </div>
                        <FontAwesomeIcon icon={faCircleArrowRight} onClick={() => handleSlide("right")} className="arrow" />
                    </div>}
                    <div className="hotelWrapper">
                        <button className="topButton" onClick={handleBooking}>Book now!</button>
                        <h1 className="hotelTitle">{hotel.hotelName}</h1>
                        <div className="hotelAdress">
                            <FontAwesomeIcon icon={faLocationDot} />
                            <span>{hotel.hotelLocation}</span>
                        </div>
                        <div className="hotelImages">
                            {loading ? "Loading Photos..." :
                                data.map((photo: any, index: number) => (
                                    <div className="imgWrapper" key={index}>
                                        <img onClick={() => handleSlider(index)} src={photo.urlPhoto} />
                                    </div>
                                ))}
                        </div>
                        <div className="hotelDescription">
                            <div className="hotelText">{hotel.hotelDescription}</div>
                            <button className="rezervationButton" onClick={handleBooking}>Book now!</button>
                        </div>
                        {openRoomMenu && <RoomMenu 
                        setOpenRoomMenu={setOpenRoomMenu} idHotel={hotel.idHotel} setHotelResponse={setHotelResponse} openRoomMenu={openRoomMenu}/>}
                        {hotelResponse && <span>{hotelResponse}</span>}
                    </div>
                </div>
            )
            }
            <Footer/>
        </div>
    );
};

export default Hotel;
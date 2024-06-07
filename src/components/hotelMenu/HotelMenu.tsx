import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./hotelMenu.css"
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import axios from "axios";

const HotelMenu = ({ setOpenHotelMenu }: any) => {
    const [hotelName, setHotelName] = useState<String>("");
    const [hotelLocation, setHotelLocation] = useState<String>("");
    const [hotelDescription, setHotelDescription] = useState<String>("");
    const [hotelRating, setHotelRating] = useState<number>(0);
    const [singleRooms, setSingleRooms] = useState<number>(0);
    const [singleRoomPrice, setSingleRoomPrice] = useState<number>(0);
    const [doubleRooms, setDoubleRooms] = useState<number>(0);
    const [doubleRoomPrice, setDoubleRoomPrice] = useState<number>(0);
    const [premiumRooms, setPremiumRooms] = useState<number>(0);
    const [premiumRoomPrice, setPremiumRoomPrice] = useState<number>(0);

    const handleAddHotel = async () => {
        if (hotelName === "" || hotelLocation === "" || hotelDescription === "" || hotelRating <= 0 || singleRooms <= 0 || doubleRooms <= 0
            || premiumRooms <= 0 || singleRoomPrice <= 0 || premiumRoomPrice <= 0 || doubleRoomPrice <= 0
        ) {
            alert("Incorect or missing information!");
        } else {
            try {
                await axios.post(`http://localhost:8091/api/hotel/saveHotel`, {
                    hotelName: hotelName,
                    hotelLocation: hotelLocation,
                    hotelDescription: hotelDescription,
                    hotelRating: hotelRating,
                    singleCameras: singleRooms,
                    doubleCameras: doubleRooms,
                    premiumCameras: premiumRooms,
                    singleCameraPrice: singleRoomPrice,
                    doubleCameraPrice: doubleRoomPrice,
                    premiumCameraPrice: premiumRoomPrice
                })
                setOpenHotelMenu(false);
                alert("Hotel saved!");
            } catch (err) {
                console.error(err);
            }
        }
    }

    return (
        <div className="hotelMenu">
            <div className="hotelMenuContainer">
                <FontAwesomeIcon icon={faCircleXmark} className="closeButton" onClick={() => setOpenHotelMenu(false)} />
                <div className="hotelOptions">
                    <span>Hotel name: </span>
                    <input type="text" placeholder="Name" onChange={e => { setHotelName(e.target.value) }} />
                    <span>Location: </span>
                    <input type="text" placeholder="Location" onChange={e => { setHotelLocation(e.target.value) }} />
                    <span>Description: </span>
                    <input type="text" placeholder="Description" onChange={e => { setHotelDescription(e.target.value) }} />
                    <span>Rating: </span>
                    <input type="number" placeholder="Rating" onChange={e => { setHotelRating(Number(e.target.value)) }} />
                    <span>Single rooms: </span>
                    <input type="number" placeholder="Single Rooms" onChange={e => { setSingleRooms(Number(e.target.value)) }} />
                    <span>Single room price: </span>
                    <input type="number" placeholder="Price" onChange={e => { setSingleRoomPrice(Number(e.target.value)) }} />
                    <span>Double rooms: </span>
                    <input type="number" placeholder="Double Rooms" onChange={e => { setDoubleRooms(Number(e.target.value)) }} />
                    <span>Double room price: </span>
                    <input type="number" placeholder="Price" onChange={e => { setDoubleRoomPrice(Number(e.target.value)) }} />
                    <span>Premium rooms: </span>
                    <input type="number" placeholder="Premium Rooms" onChange={e => { setPremiumRooms(Number(e.target.value)) }} />
                    <span>Premium room price: </span>
                    <input type="number" placeholder="Price" onChange={e => { setPremiumRoomPrice(Number(e.target.value)) }} />
                </div>
                <button className="addButton" onClick={handleAddHotel}>Add Hotel</button>
            </div>
        </div>
    );
};

export default HotelMenu;
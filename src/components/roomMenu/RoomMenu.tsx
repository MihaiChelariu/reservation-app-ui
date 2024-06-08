import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./roomMenu.css"
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import useFetch from "../../hooks/useFetch";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { addDays, format } from "date-fns";

const RoomMenu = ({ setOpenRoomMenu, idHotel, setHotelResponse, openRoomMenu }: any) => {
    const [roomCounter, setRoomCounter] = useState({
        single: 0,
        double: 0,
        premium: 0
    });

    const [availableRooms, setAvailableRooms] = useState({
        single: 999,
        double: 999,
        premium: 999
    })

    const dateCookie = Cookies.get("date");
    const date = dateCookie ? JSON.parse(dateCookie) : {};

    const optionsCookie = Cookies.get("options");
    const options = optionsCookie ? JSON.parse(optionsCookie) : {};

    const { data, loading, error } = useFetch(`http://localhost:8091/api/hotel/getRoomsAvailable/${idHotel}?checkin=${format(new Date(date.startDate), 'yyyy-MM-dd')}&checkout=${format(new Date(date.endDate), 'yyyy-MM-dd')}`);

    for (const day of data) {
        if (day.availableSingleRooms < availableRooms.single)
            setAvailableRooms(prevRooms => ({
                ...prevRooms,
                single: day.availableSingleRooms
            }));
        if (day.availableDoubleRooms < availableRooms.double)
            setAvailableRooms(prevRooms => ({
                ...prevRooms,
                double: day.availableDoubleRooms
            }));
        if (day.availablePremiumRooms < availableRooms.premium)
            setAvailableRooms(prevRooms => ({
                ...prevRooms,
                premium: day.availablePremiumRooms
            }));
    }

    console.log(options.adults);
    console.log(options.children);
    console.log(date.startDate);
    console.log(date.endDate);
    console.log(format(new Date(date.startDate), 'yyyy-MM-dd'));
    console.log(format(new Date(date.endDate), 'yyyy-MM-dd'));

    const handleRoomChange = (toModify: keyof typeof roomCounter, modifier: "increase" | "decrease") => {
        setRoomCounter((prev) => {
            const newValue = modifier === "increase" ? prev[toModify] + 1 : prev[toModify] - 1;

            if (newValue >= 0)
                return {
                    ...prev,
                    [toModify]: newValue,
                };
            else
                return prev;
        });

    }

    const handleReservation = async () => {
        if (roomCounter.single === 0 && roomCounter.double === 0 && roomCounter.premium === 0) {
            setHotelResponse("No rooms selected");
        } else {
            try {

                const response = await axios.put(`http://localhost:8091/api/hotel/updateCameras/${idHotel}
                    ?checkin=${format(new Date(date.startDate), 'yyyy-MM-dd')}&checkout=${format(new Date(date.endDate), 'yyyy-MM-dd')}&singleCameras=${roomCounter.single}&doubleCameras=${roomCounter.double}&premiumCameras=${roomCounter.single}`);

                console.log(response);

                if (response.data != "") {
                    const status = await axios.post(`http://localhost:8092/api/rezervation/saveRezervation`, {
                        idUser: Cookies.get("userLogin"),
                        idHotel: idHotel,
                        checkinDate: format(new Date(date.startDate), 'yyyy-MM-dd'),
                        checkoutDate: format(new Date(date.endDate), 'yyyy-MM-dd'),
                        nrSingleRooms: roomCounter.single,
                        nrDoubleRooms: roomCounter.double,
                        nrPremiumRooms: roomCounter.premium
                    });
                    setRoomCounter({
                        single: 0,
                        double: 0,
                        premium: 0
                    });
                    setHotelResponse("Rezervation made!");
                } else {
                    console.log("failed");
                    setHotelResponse("Rezervation failed!");
                }

                console.log("Reservation made!");
            } catch (err) {
                console.log(err);
                const e: AxiosError = err as AxiosError;
                if (e.response) {
                    setHotelResponse(e.response.data);
                } else if (e.request) {
                    setHotelResponse("Request failed, please try again.");
                } else {
                    setHotelResponse("An error occurred, please try again later.");
                }
                
            }
            setOpenRoomMenu(false);
        }
    }

    return (
        <div className="rooms">
            <div className="roomsContainer">
                <FontAwesomeIcon icon={faCircleXmark} className="closeButton" onClick={() => setOpenRoomMenu(false)} />
                <span>Select rooms: </span>
                {data &&
                    <div className="roomOptions">
                        <span>Single Room:</span>
                        <div className="optionCounter">
                            <button disabled={roomCounter.single <= 0}
                                onClick={() => handleRoomChange("single", "decrease")} className="optionCounterButton">-</button>
                            <span className="optionText">{roomCounter.single}</span>
                            <button disabled={roomCounter.single >= availableRooms.single}
                                onClick={() => handleRoomChange("single", "increase")} className="optionCounterButton">+</button>
                        </div>
                        <span>Double Room:</span>
                        <div className="optionCounter">
                            <button disabled={roomCounter.double <= 0}
                                onClick={() => handleRoomChange("double", "decrease")} className="optionCounterButton">-</button>
                            <span className="optionText">{roomCounter.double}</span>
                            <button disabled={roomCounter.double >= availableRooms.double}
                                onClick={() => handleRoomChange("double", "increase")} className="optionCounterButton">+</button>
                        </div>
                        <span>Premium Room:</span>
                        <div className="optionCounter">
                            <button disabled={roomCounter.premium <= 0}
                                onClick={() => handleRoomChange("premium", "decrease")} className="optionCounterButton">-</button>
                            <span className="optionText">{roomCounter.premium}</span>
                            <button disabled={roomCounter.premium >= availableRooms.premium}
                                onClick={() => handleRoomChange("premium", "increase")} className="optionCounterButton">+</button>
                        </div>
                    </div>}
                <button onClick={handleReservation} className="reservationButton">Reserve rooms!</button>
            </div>
        </div>
    );
};

export default RoomMenu;
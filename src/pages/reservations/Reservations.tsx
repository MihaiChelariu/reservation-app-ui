import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import useFetch from "../../hooks/useFetch";
import Cookies from "js-cookie";
import "./reservations.css"
import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";

const Reservations = () => {
    const userId = Cookies.get("userLogin");
    const {data, loading, error} = useFetch(`http://localhost:8092/api/rezervation/getAllUserRezervations/${userId}`);
    const [hotels, setHotels] = useState<any>();

    useEffect(() => {
        const fetchHotels = async () => {
            const hotelData = await Promise.all(data.map(async (reservation: any) => {
                const response = await axios.get(`http://localhost:8091/api/hotel/getHotel/${reservation.idHotel}`);
                return response.data;
            }));
            setHotels(hotelData);
        };

        if (data) {
            fetchHotels();
        }
    }, [data]);

    const handleCancel = async (res: any, hotelId: number) => {
        try{
            const response = await axios.put(`http://localhost:8091/api/hotel/cancelReservation/${hotelId}
                ?checkin=${res.checkinDate}&checkout=${res.checkoutDate}&singleCameras=${res.nrSingleRooms}&doubleCameras=${res.nrDoubleRooms}&premiumCameras=${res.nrPremiumRooms}`);

            console.log(response);
            console.log(res.nrDoubleRooms);

            if(response.data != ""){
                await axios.delete(`http://localhost:8092/api/rezervation/deleteRezervation/${res.idRezervare}`);
                alert("reservation canceled!");
            }else{
                alert("something went wrong!");
            }
        }catch(err){
            console.error(err);
            alert(err);
        }
    }

    return(
        <div className="reservations">

            <Navbar/>
            <Header type="list"/>
            <div className="reservationsContainer">
                <span style={{fontWeight: "bold"}}>My Reseravtions</span>
                {loading ? "Loading..." : 
                data && data.map((reservation: any, index: number) => (
                    <div key={index} className="reservationData">
                        <span className="reservationText">Hotel: <br/><span>{hotels[index]?.hotelName}</span></span>
                        <span className="reservationText">Check In: <br/><span>{reservation.checkinDate}</span></span>
                        <span className="reservationText">Check Out: <br/><span>{reservation.checkoutDate}</span></span>
                        <span className="reservationText">Single Rooms: <br/><span>{reservation.nrSingleRooms}</span></span>
                        <span className="reservationText">Double Rooms: <br/><span>{reservation.nrDoubleRooms}</span></span>
                        <span className="reservationText">Premium Rooms: <br/><span>{reservation.nrPremiumRooms}</span></span>
                        <button className="cancelReservation" onClick={()=>handleCancel(reservation, hotels[index].idHotel)}>Cancel reservation</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Reservations;
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

import "./featured.css"
import useFetch from "../../hooks/useFetch";
import { useNavigate } from "react-router-dom";

const Featured = () => {
    
    const [photo, setPhoto] = useState<string[]>([]);
    const {data: hotels, loading: loadingHotels, error: hotelError} = useFetch("http://localhost:8091/api/hotel/getAllHotels");
    const navigate = useNavigate();

    const dateCookie = Cookies.get("date");
    const date = dateCookie ? JSON.parse(dateCookie) : {};

    useEffect(() => {
        const fetchFirstPhotos = async () => {
            const firstPhotos: string[] = [];
            for (const hotel of hotels) {
                try {
                    const response = await axios.get(`http://localhost:8091/api/photos/getFirstByHotelId/${hotel.idHotel}`);
                    firstPhotos.push(response.data.urlPhoto);
                } catch(error){
                    console.log(error);
                    firstPhotos.push('');
                }
            }
            setPhoto(firstPhotos);
        };

        if (hotels.length > 0) {
            fetchFirstPhotos();
        }
    }, [hotels]);

    const firstSixHotels = hotels.slice(0, 6);
    

    const handleClick = (index: number)=>{
        if(Cookies.get("date"))
            navigate(`/hotel/${hotels[index].idHotel}`);
        else
            alert("Select a date!");
    }

    return(
        <div className="featured">
            {loadingHotels ? (
                <p>Loading hotels...</p>
            ) : (
                <div className="featuredContainer">
                    {hotels.map((hotel: any, index: number) => (
                    <div key={index} className="featuredItem" onClick={()=>handleClick(index)}>
                        <img src={photo[index]}/>
                        <h1>{hotel.hotelName}</h1>
                    </div>
                ))}
                </div>
            )}
        </div>
    );

};

export default Featured;
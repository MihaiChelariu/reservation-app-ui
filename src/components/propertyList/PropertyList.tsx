import "./propertyList.css"
import axios from 'axios'
import { useState, useEffect } from "react";

const PropertyList = () => {
    const [hotels, setHotels] = useState([]);
    const [photo, setPhoto] = useState<string[]>([]);

    useEffect(() => {
        const getHotels = async () => {
            try {
                const response = await axios.get('http://localhost:8091/api/hotel/getAllHotels');
                setHotels(response.data);
            } catch (error) {
                console.error('Error: ', error);
            }
        }

        getHotels();
        console.log(hotels);
    }, []);

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

    useEffect(() => {
        console.log("Photo URLs:", photo);
    }, [photo]);

    return (
        <div className="propertyList">
        {hotels.length > 0 ? (
            <div>
                {photo.length === hotels.length ? (
                    hotels.map((item, index) => (
                        <div key={index} className="propertyListItem">
                            <img src={photo[index]} alt={`Hotel ${index}`} />
                            <h1>{item.hotelName}</h1>
                        </div>
                    ))
                ) : (
                    <p>Loading photos...</p>
                )}
            </div>
        ) : (
            <p>Loading hotels...</p>
        )}
    </div>
    );
};

export default PropertyList;

{/* <div className="propertyListItem">
    <img src="https://www.travelandleisure.com/thmb/OdtEHSekDqPEXeG5k2zkp5kqiHo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/soneva-jani-sunset-view-maldives-SONEVA0421-74b37591d80441ce87831a41da518e49.jpg" className="propertyListImage" />
    <div className="propertyListTitles">
        <h1>Hotels</h1>
        <h2>2561789 hotels</h2>
    </div>
</div> */}
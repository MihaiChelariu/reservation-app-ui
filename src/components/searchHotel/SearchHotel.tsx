import { useNavigate, useParams } from "react-router-dom";

import "./searchHotel.css"
import useFetch from "../../hooks/useFetch";

const SearchHotel = ({hotel, destination, date, options}:any) => {
    const navigate = useNavigate();
    const {data, loading, error} = useFetch(`http://localhost:8091/api/photos/getFirstByHotelId/${hotel.idHotel}`);
    var minimumPrice: number = 999999999999;

    if(hotel.singleCameraPrice < minimumPrice)
      minimumPrice = hotel.singleCameraPrice;
    else if(hotel.doubleCameraPrice < minimumPrice)
      minimumPrice = hotel.doubleCameraPrice;
    else if(hotel.premiumCameraPrice < minimumPrice)
      minimumPrice = hotel.premiumCameraPrice;

    const handleAvailability = () =>{
      navigate(`/hotel/${hotel.idHotel}`, { state: {
        destination: destination, 
        date: date,
        options: options } });
    }

    return(
      <div className="searchItem">
        <img src={data.urlPhoto} alt="" className="itemImg" />
        <div className="itemDescription">
            <h1 className="itemTitle">{hotel.hotelName}</h1>
            <span>The hotel from {hotel.hotelLocation} has:
                <ul>single, double and premium rooms!</ul>
            </span>
        </div>
        <div className="itemDetails">
            <div className="itemRating">
              <span>From</span>
              <button>{hotel.hotelRating}</button>
            </div>
            <div className="itemText">
                <span className="itemPrice">{minimumPrice} RON</span>
            </div>
            <button onClick={() => handleAvailability()}>Book rooms</button>
        </div>
      </div>
    );
};

export default SearchHotel;
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import SearchHotel from "../../components/searchHotel/SearchHotel";

import "./hotelList.css";
import useFetch from "../../hooks/useFetch";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { format } from "date-fns";

const HotelList = () => {
  const { destination } = useParams<{ destination: string }>();
  const [filteredData, setFilteredData] = useState<any>([]);
  const [minPriceChecked, setMinPriceChecked] = useState<boolean>(false);
  const [maxPriceChecked, setMaxPriceChecked] = useState<boolean>(false);
  const [minRatingChecked, setMinRatingChecked] = useState<boolean>(false);
  const [maxRatingChecked, setMaxRatingChecked] = useState<boolean>(false);

  const dateCookie = Cookies.get("date");
  const date = dateCookie ? JSON.parse(dateCookie) : {};

  const optionsCookie = Cookies.get("options");
  const peopleOptions = optionsCookie ? JSON.parse(optionsCookie) : {};

  const { data, loading, error } = useFetch(`http://localhost:8091/api/hotel/getHotelsByLocation/${destination}?checkin=${format(new Date(date.startDate), 'yyyy-MM-dd')}&checkout=${format(new Date(date.endDate), 'yyyy-MM-dd')}&people=${peopleOptions.adults + peopleOptions.children}`);

  useEffect(() => {
    if (data) {
      setFilteredData(data); 
    }
  }, [data]);

  const handleApplyFilters = () => {
    let filtered = [...data];

    if (minPriceChecked) {
      filtered = filtered.sort((a: any, b: any) => a.singleCameraPrice - b.singleCameraPrice);
    }
    if (maxPriceChecked) {
      filtered = filtered.sort((a: any, b: any) => b.singleCameraPrice - a.singleCameraPrice);
    }
    if (minRatingChecked) {
      filtered.sort((a: any, b: any) => a.hotelRating - b.hotelRating);
    }
    if (maxRatingChecked) {
      filtered.sort((a: any, b: any) => b.hotelRating - a.hotelRating);
    }

    setFilteredData(filtered);
  };

  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listFilters">
            <h1 className="lfTitle">Order by</h1>
            <div className="filterItem">
              <input type="checkbox" id="minPrice" checked={minPriceChecked} onChange={() => setMinPriceChecked(!minPriceChecked)} onClick={() => { setMaxPriceChecked(false); setMinRatingChecked(false); setMaxRatingChecked(false); }} />
              <label htmlFor="minPrice">Min. price</label>
            </div>
            <div className="filterItem">
              <input type="checkbox" id="maxPrice" checked={maxPriceChecked} onChange={() => setMaxPriceChecked(!maxPriceChecked)} onClick={() => { setMinPriceChecked(false); setMinRatingChecked(false); setMaxRatingChecked(false); }} />
              <label htmlFor="maxPrice">Max. price</label>
            </div>
            <div className="filterItem">
              <input type="checkbox" id="minRating" checked={minRatingChecked} onChange={() => setMinRatingChecked(!minRatingChecked)} onClick={() => { setMaxPriceChecked(false); setMinPriceChecked(false); setMaxRatingChecked(false); }} />
              <label htmlFor="minRating">Min. Rating</label>
            </div>
            <div className="filterItem">
              <input type="checkbox" id="maxRating" checked={maxRatingChecked} onChange={() => setMaxRatingChecked(!maxRatingChecked)} onClick={() => { setMaxPriceChecked(false); setMinRatingChecked(false); setMinPriceChecked(false); }} />
              <label htmlFor="maxRating">Max. Rating</label>
            </div>
            <button onClick={handleApplyFilters}>Apply</button>
          </div>
          <div className="listResults">
            {loading ? "Loading..." :
              filteredData.length > 0 ? (
                filteredData.map((hotel: any) => (
                  <SearchHotel hotel={hotel} destination={destination} key={hotel.idHotel}></SearchHotel>
                ))
              ) : (
                <p>No hotels available</p>
              )
            }
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HotelList;

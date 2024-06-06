import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import SearchHotel from "../../components/searchHotel/SearchHotel";

import "./hotelList.css"
import useFetch from "../../hooks/useFetch";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { format } from "date-fns";
  
const HotelList = () => {

  const { destination } = useParams<{ destination: string}>();
  const [min, setMin] = useState<number>(0);
  const [max, setMax] = useState<number>(999);
  const location = useLocation();
  const { paramDate, paramPeopleOptions} = location.state;
  const [filteredData, setFilteredData] = useState<any>([]);
  // const startDate = format(new Date(date[0].startDate), 'yyyy-MM-dd');
  // const endDate = format(new Date(date[0].endDate), 'yyyy-MM-dd');
  // console.log(peopleOptions.adults + peopleOptions.children);
  // console.log(startDate);
  // console.log(endDate);

  const dateCookie = Cookies.get("date");
  const date = dateCookie ? JSON.parse(dateCookie) : {};

  const optionsCookie = Cookies.get("options");
  const peopleOptions = optionsCookie ? JSON.parse(optionsCookie) : {};
  const { data, loading, error } = useFetch(`http://localhost:8091/api/hotel/getHotelsByLocation/${destination}?checkin=${format(new Date(date.startDate), 'yyyy-MM-dd')}&checkout=${format(new Date(date.endDate), 'yyyy-MM-dd')}&people=${peopleOptions.adults + peopleOptions.children}`);

  // useEffect(() => {
  //   setFilteredData([]);
  //   for(const hotel of data){
  //     if(min != undefined)
  //       if(hotel.singleCameraPrice >= min)
  //         setFilteredData([...filteredData, hotel]);
  //     if(max != undefined)
  //       if(hotel.singleCameraPrice <= max)
  //         setFilteredData([...filteredData, hotel]);
  //   }
  //   if(filteredData == null)
  //     setFilteredData(data);
  // }, [min, max]);

  const handleClick = () => {

  }

  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listFilters">
            <h1 className="lfTitle">Filter</h1>
            <div className="filterNrItem">
              <label className="filterText">Min. price <small>per night</small></label>
              <input type="number" min={0} onChange={e=>setMin(parseInt(e.target.value))} className="filterInput" />
            </div>
            <div className="filterNrItem">
              <label className="filterText">Max. price <small>per night</small></label>
              <input type="number" min={0} onChange={e=>setMax(parseInt(e.target.value))} className="filterInput" />
            </div>
            <div className="filterItem">
              <label className="listFilterText">Property Type:</label>
              <form>
                <ul>
                  <li>
                    <input type="checkbox" id="hotel" name="checkboxItems" value="Item 1" />
                    <label htmlFor="hotel">Hotel</label>
                  </li>
                  <li>
                    <input type="checkbox" id="cabin" name="checkboxItems" value="Item 2" />
                    <label htmlFor="cabin">Cabin</label>
                  </li>
                  <li>
                    <input type="checkbox" id="appartament" name="checkboxItems" value="Item 3" />
                    <label htmlFor="appartament">Appartament</label>
                  </li>
                  <li>
                    <input type="checkbox" id="resort" name="checkboxItems" value="Item 3" />
                    <label htmlFor="resort">Resort</label>
                  </li>
                </ul>
              </form>
            </div>
            <div className="filterItem">
              <label className="listFilterText">Min. Rating:</label>
              <form>
                <ul>
                  <li>
                    <input type="checkbox" id="hotel" name="checkboxItems" value="Item 1" />
                    <label htmlFor="hotel">5</label>
                  </li>
                  <li>
                    <input type="checkbox" id="cabin" name="checkboxItems" value="Item 2" />
                    <label htmlFor="cabin">4</label>
                  </li>
                  <li>
                    <input type="checkbox" id="appartament" name="checkboxItems" value="Item 3" />
                    <label htmlFor="appartament">3</label>
                  </li>
                  <li>
                    <input type="checkbox" id="resort" name="checkboxItems" value="Item 3" />
                    <label htmlFor="resort">2</label>
                  </li>
                  <li>
                    <input type="checkbox" id="resort" name="checkboxItems" value="Item 3" />
                    <label htmlFor="resort">1</label>
                  </li>
                </ul>
              </form>
            </div>
            <div className="filterItem">
              <label className="listFilterText">Property Score:</label>
              <form>
                <ul>
                  <li>
                    <input type="checkbox" id="hotel" name="checkboxItems" value="Item 1" />
                    <label htmlFor="hotel">5 stars</label>
                  </li>
                  <li>
                    <input type="checkbox" id="cabin" name="checkboxItems" value="Item 2" />
                    <label htmlFor="cabin">4 stars</label>
                  </li>
                  <li>
                    <input type="checkbox" id="appartament" name="checkboxItems" value="Item 3" />
                    <label htmlFor="appartament">3 stars</label>
                  </li>
                  <li>
                    <input type="checkbox" id="resort" name="checkboxItems" value="Item 3" />
                    <label htmlFor="resort">2 stars</label>
                  </li>
                  <li>
                    <input type="checkbox" id="resort" name="checkboxItems" value="Item 3" />
                    <label htmlFor="resort">1 star</label>
                  </li>
                </ul>
              </form>
            </div>
            <button onClick={handleClick}>Apply</button>
          </div>
          <div className="listResults">
            {loading ? "Loading..." :
              data.length > 0 ? (
                data.map((hotel: any) => (
                  <SearchHotel hotel={hotel} destination={destination} date={paramDate} options={paramPeopleOptions} key={hotel.idHotel}></SearchHotel>
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
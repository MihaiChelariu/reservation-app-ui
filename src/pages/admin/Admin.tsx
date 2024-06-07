import { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import useFetch from "../../hooks/useFetch";
import "./admin.css"
import axios from "axios";
import HotelMenu from "../../components/hotelMenu/HotelMenu";

const Admin = () => {
    const { data, loading, error } = useFetch(`http://localhost:8091/api/hotel/getAllHotels`);
    const [hotelName, setHotelName] = useState<string>("");
    const [filteredHotels, setFilteredHotels] = useState<any[]>([]);
    const [searched, setSearched] = useState(false);
    const [openHotelMenu, setOpenHotelMenu] = useState(false);

    useEffect(() => {
        if (!loading && !error) {
            setFilteredHotels(data); 
        }
    }, [data, loading, error]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const handleSearch = () => {
        if (hotelName.trim() === "") {
            setFilteredHotels(data); 
        } else {
            const filtered = data.filter((hotel: any) =>
                hotel.hotelName.toLowerCase().includes(hotelName.trim().toLowerCase())
            );
            setFilteredHotels(filtered);
        }
        setSearched(true);
    }

    const handleAddHotel = () => {
        setOpenHotelMenu(true);
    }

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`http://localhost:8091/api/hotel/deleteHotelById/${id}`);
            setFilteredHotels(filteredHotels.filter(hotel => hotel.id !== id));
            alert("Hotel Deleted!");
        } catch (error) {
            console.error('Error deleting hotel:', error);
        }
    }

    return (
        <div className="admin">
            <Navbar />
            <div className="search">
                <input
                    type="text"
                    placeholder="Hotel Name"
                    className="hotelSearch"
                    value={hotelName}
                    onChange={e => { setHotelName(e.target.value) }}
                />
                <button className="adminButton" onClick={handleSearch}>Search</button>
            </div>
            <div className="hotelContainer">
                    {filteredHotels.length > 0 ? (
                        filteredHotels.map((hotel: any, index: number) => (
                            <div key={index} className="hotelData">
                                <span className="dataText">Hotel: <br /> <span className="data">{hotel.hotelName}</span></span>
                                <span className="dataText">Location: <br /> <span className="data">{hotel.hotelLocation ? hotel.hotelLocation : "-"}</span></span>
                                <span className="dataText">Single Rooms: <br /> <span className="data">{hotel.singleCameras}</span></span>
                                <span className="dataText">Double Rooms: <br /> <span className="data">{hotel.doubleCameras}</span></span>
                                <span className="dataText">Premium Rooms: <br /> <span className="data">{hotel.premiumCameras}</span></span>
                                <button className="adminButton">Add photo</button>
                                <button className="adminButton" onClick={() => handleDelete(hotel.idHotel)} style={{ background: 'red' }}>Delete Hotel</button>
                            </div>
                        ))
                    ) : (
                        <p>No hotels found</p>
                    )
                }
            </div>
            <button className="adminButton" onClick={handleAddHotel}>Add Hotel</button>
            {openHotelMenu && <HotelMenu setOpenHotelMenu={setOpenHotelMenu}/>}
        </div>
    );
};

export default Admin;

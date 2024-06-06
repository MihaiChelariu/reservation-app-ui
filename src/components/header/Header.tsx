import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faHotel, faPerson } from "@fortawesome/free-solid-svg-icons";
import { DateRange } from 'react-date-range';
import { format } from "date-fns";
import { useContext, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import Cookies from "js-cookie";

import "./header.css";
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import useFetch from "../../hooks/useFetch";

const Header = ({ type }: any) => {
    const [isLogged, setIsLogged] = useState(!!Cookies.get("userLogin"));
    const [destination, setDestination] = useState("");
    const [date, setDate] = useState<any[]>([{
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
    }]);
    const [openDate, setOpendate] = useState(false);
    const [peopleOptions, setPeopleOptions] = useState({
        adults: 2,
        children: 0,
        rooms: 1
    })
    const navigate = useNavigate();
    const [openPeopleOptions, setOpenPeopleOptions] = useState(false);
    Cookies.set("options", JSON.stringify(peopleOptions));

    const handlePeopleChange = (toModify: keyof typeof peopleOptions, modifier: "increase" | "decrease") => {
        setPeopleOptions((prev) => {
            const updatedOptions = {
                ...prev,
                [toModify]: modifier === "increase" ? prev[toModify] + 1 : prev[toModify] - 1,
            };
            Cookies.set("options", JSON.stringify(updatedOptions));
            return updatedOptions;
        });
    };

    const handleDateChange = (newDate: any) => {
        setDate([newDate]);
        console.log("NEW DATE: ", date[0]);
        Cookies.set("date", JSON.stringify(newDate));
        console.log("NEW COOKIE: ", Cookies.get("date"));
    }

    const handleSearch = () => {
        if (destination === "") {
            alert("Please type the city you want to go to!");
            setOpendate(false);
        } else if (Cookies.get("date") === undefined) {
            setOpendate(true);
            alert("Select a period!");
        } else {
            navigate(`/hotels/${destination}?date=${date}&people=${peopleOptions}`, {
                state: {
                    destination,
                    date,
                    peopleOptions,
                }
            });
        }
    };

    const location = useLocation();
    useEffect(() => {
        const { state } = location;
        if (state) {
            setDestination(state.destination || "City");
            setDate(state.date || [
                {
                    startDate: new Date(),
                    endDate: new Date(),
                    key: 'selection',
                },
            ]);
            setPeopleOptions(state.peopleOptions || {
                adults: 2,
                children: 0,
                rooms: 1,
            });
        }
    }, [location]);

    const handleLogIn = () => {
        navigate("/login");
    }

    return (
        <div className="header">
            <div className={type === "list" ? "headerContainer list" : "headerContainer"}>
                {type !== "list" && <>
                    <h1 className="headerTitle">Proiect de licenta</h1>
                    <p className="headerDescription">Implementare tranzactiilor in aplicatii web</p>
                    {!isLogged && <button className="headerButton" onClick={handleLogIn}>Logg in/Sign up</button>}
                </>}
                <div className="headerSearch">
                    <div className="headerSearchItem">
                        <FontAwesomeIcon icon={faHotel} className="headerIcon" />
                        <input className="headerSearchInput" type="text" placeholder={destination || "City"} value={destination} onChange={e => setDestination(e.target.value)} onClick={() => { setOpendate(false); setOpenPeopleOptions(false); }} />
                    </div>
                    <div className="headerSearchItem">
                        <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
                        <span onClick={() => { setOpendate(!openDate); setOpenPeopleOptions(false); }} className="headerSearchText">{`${format(date[0].startDate, "dd/MM/yyyy")}`} to {`${format(date[0].endDate, "dd/MM/yyyy")}`}</span>
                        {openDate && <DateRange
                            editableDateInputs={true}
                            onChange={item => handleDateChange(item.selection)}
                            moveRangeOnFirstSelection={false}
                            ranges={date}
                            className="date"
                            minDate={new Date()}
                        />}
                    </div>
                    <div className="headerSearchItem">
                        <FontAwesomeIcon icon={faPerson} className="headerIcon" />
                        <span onClick={() => { setOpenPeopleOptions(!openPeopleOptions); setOpendate(false); }} className="headerSearchText">{`${peopleOptions.adults}`} adults - {`${peopleOptions.children}`} children - {`${peopleOptions.rooms}`} rooms</span>
                        {openPeopleOptions && <div className="options">
                            <div className="optionItem">
                                <span className="optionText">Adults</span>
                                <div className="optionCounter">
                                    <button disabled={peopleOptions.adults <= 1} className="optionCounterButton" onClick={() => handlePeopleChange("adults", "decrease")}>-</button>
                                    <span className="optionText">{`${peopleOptions.adults}`}</span>
                                    <button className="optionCounterButton" onClick={() => handlePeopleChange("adults", "increase")}>+</button>
                                </div>
                            </div>
                            <div className="optionItem">
                                <span className="optionText">Children</span>
                                <div className="optionCounter">
                                    <button disabled={peopleOptions.children < 1} className="optionCounterButton" onClick={() => handlePeopleChange("children", "decrease")}>-</button>
                                    <span className="optionText">{`${peopleOptions.children}`}</span>
                                    <button className="optionCounterButton" onClick={() => handlePeopleChange("children", "increase")}>+</button>
                                </div>
                            </div>
                            <div className="optionItem">
                                <span className="optionText">Rooms</span>
                                <div className="optionCounter">
                                    <button disabled={peopleOptions.rooms <= 1} className="optionCounterButton" onClick={() => handlePeopleChange("rooms", "decrease")}>-</button>
                                    <span className="optionText">{`${peopleOptions.rooms}`}</span>
                                    <button disabled={peopleOptions.rooms >= peopleOptions.adults + peopleOptions.children} className="optionCounterButton" onClick={() => handlePeopleChange("rooms", "increase")}>+</button>
                                </div>
                            </div>
                        </div>}
                    </div>
                    <button className="headerButton" onClick={handleSearch}>Search</button>
                </div>
            </div>
        </div>
    );
};

export default Header;
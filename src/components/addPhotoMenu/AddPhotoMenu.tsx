import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./addPhotoMenu.css"
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import axios from "axios";

const AddPhotoMenu = ({setOpenPhotoMenu, hotelId}: any) => {
    const [type, setType] = useState<string>("");
    const [url, setUrl] = useState<string>("");

    const handleAddPhoto = async () => {
        if(url === ""){
            alert("Photo URL missing!");
        } else {
            try{
                axios.post(`http://localhost:8091/api/photos/savePhoto`,{
                    idHotel: hotelId,
                    urlPhoto: url,
                    photoType: type
                });
                setOpenPhotoMenu(false);
                alert("Photo saved!");
            } catch (err){
                console.error(err);
                alert(err);
            }
        }
    }

    return(
        <div className="addPhotoMenu">
            <div className="addPhotoMenuContainer">
            <FontAwesomeIcon icon={faCircleXmark} className="closeButton" onClick={() => setOpenPhotoMenu(false)} />
                <div className="addPhotoOptions">
                    <span>Photo type: </span>
                    <select id="dropdown" value={type} onChange={e => setType(e.target.value)}>
                        <option value="">Hotel</option>
                        <option value="single">Single room</option>
                        <option value="double">Double room</option>
                        <option value="premium">Premium room</option>
                    </select>
                    <span>Photo URL</span>
                    <input type="text" placeholder="URL" onChange={e => {setUrl(e.target.value)}}/>
                </div>
                <button className="addPhotoButton" onClick={handleAddPhoto}>Add Photo</button>
            </div>
        </div>
    );
};

export default AddPhotoMenu;
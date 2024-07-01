import "./home.css"
import "../../components/navbar/Navbar"
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import Featured from "../../components/featuredHotels/Featured";
import Footer from "../../components/footer/Footer";
import Cookies from "js-cookie";

const Home = () => {
    if(Cookies.get("date")) Cookies.remove("date");
    if(Cookies.get("options")) Cookies.remove("options");

    return (
        <div>
            <Navbar />
            <Header />
            <div className="homeContainer">
                <h1 className="homeTitle">Available Hotels</h1>
                <Featured />
                <Footer />
            </div>
        </div>
    );
};

export default Home;
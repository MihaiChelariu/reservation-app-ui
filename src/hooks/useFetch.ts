import { useState, useEffect } from "react";
import axios from "axios";

const useFetch = (url: string) =>{
    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(false);

    useEffect (() =>{
        const fetchData = async ()=>{
            setLoading(true);

            try{
                const response = await axios.get(url);
                setData(response.data)
            }catch(err){
                setError(err);
            }
            setLoading(false);
        }
        fetchData();
    }, [url]);
    return {data, loading, error};
};

export default useFetch;
import {useNavigate} from "react-router";
import {useEffect} from "react";


export default function Register(){
    const navigate = useNavigate();

    useEffect(() => {
        navigate("/");

        requestAnimationFrame(() => {
            setTimeout(() => {
                document.dispatchEvent(new CustomEvent('open-login'));
            }, 100);
        });
    }, [navigate]);


    return null;
}

import { useEffect } from "react";
import {useNavigate} from "react-router";


export default function Login(){
    const navigate = useNavigate();

    useEffect(() => {
        navigate("/");

        requestAnimationFrame(() => {
            setTimeout(() => {
                document.dispatchEvent(new CustomEvent('open-register'));
            }, 100);
        });
    }, [navigate]);

    return null;
}
import {useNavigate} from "react-router";
import {useEffect} from "react";
import {HOME_ROUTE} from "@/constants/routes.ts";


export default function Register(){
    const navigate = useNavigate();

    useEffect(() => {
        navigate(HOME_ROUTE);

        requestAnimationFrame(() => {
            setTimeout(() => {
                document.dispatchEvent(new CustomEvent('open-login'));
            }, 100);
        });
    }, [navigate]);


    return null;
}

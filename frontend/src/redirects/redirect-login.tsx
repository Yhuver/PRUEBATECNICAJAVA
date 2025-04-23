import { useEffect } from "react";
import {useNavigate} from "react-router";
import {HOME_ROUTE} from "@/constants/routes.ts";


export default function Login(){
    const navigate = useNavigate();

    useEffect(() => {
        navigate(HOME_ROUTE);

        requestAnimationFrame(() => {
            setTimeout(() => {
                document.dispatchEvent(new CustomEvent('open-register'));
            }, 100);
        });
    }, [navigate]);

    return null;
}
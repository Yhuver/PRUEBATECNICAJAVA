import { useState} from "react";
import LoginModal from "@/components/templates/login-modal.tsx";
import RegisterModal from "@/components/templates/register-modal.tsx";
import { Link } from "react-router";
import { useAuthContext } from "@/contexts/AuthContext.tsx";
import NavbarUnlogged from "@/components/organisms/navbar-unlogged.tsx";
import NavbarLogged from "@/components/organisms/navbar-logged.tsx";
import NavbarOptions from "@/components/organisms/navbar-options.tsx";
import {HOME_ROUTE} from "@/constants/routes.ts";

export default function Navbar() {

    const { isAuthenticated} = useAuthContext();

    const [loginOpen, setLoginOpen] = useState(false);
    const [registerOpen, setRegisterOpen] = useState(false);

    const handleLoginOpen = () => {
        setLoginOpen(true);
        setRegisterOpen(false);
    };

    const handleRegisterOpen = () => {
        setRegisterOpen(true);
        setLoginOpen(false);
    };

    console.log("Navbar render. isAuthenticated:", isAuthenticated);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link to={HOME_ROUTE} className="font-bold text-xl">
                        TransactionApp
                    </Link>
                    <NavbarOptions/>
                </div>

                <div className="flex items-center gap-3">
                    <></>
                    { !isAuthenticated ?
                        <NavbarUnlogged handleLoginOpen={handleLoginOpen} handleRegisterOpen={handleRegisterOpen} />
                        : <NavbarLogged/>
                       }
                </div>
            </div>

            <LoginModal open={loginOpen} onOpenChange={setLoginOpen} setRegisterOpen={setRegisterOpen}/>
            <RegisterModal open={registerOpen} onOpenChange={setRegisterOpen} setLoginOpen={setLoginOpen}/>
        </header>
    );
}

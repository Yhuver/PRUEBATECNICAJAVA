import { useState} from "react";
import { Link } from "react-router";
import { useAuthContext } from "@/contexts/AuthContext.tsx";
import {HOME_ROUTE} from "@/constants/routes.ts";
import NavbarOptions from "@/components/organisms/navbar/NavbarOptions.tsx";
import NavbarUnlogged from "@/components/organisms/navbar/NavbarUnlogged.tsx";
import NavbarLogged from "@/components/organisms/navbar/NavbarLogged.tsx";
import LoginModal from "@/components/organisms/auth/LoginModal.tsx";
import RegisterModal from "@/components/organisms/auth/RegisterModal.tsx";

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

    return (
        <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-black">
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

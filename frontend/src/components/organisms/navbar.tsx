import { useState} from "react";
import LoginModal from "@/components/organisms/login-modal.tsx";
import RegisterModal from "@/components/organisms/register-modal.tsx";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import { useAuthContext } from "@/contexts/AuthContext.tsx";

const routes = [
    { href: "/transactions", label: "Transacciones" },
];

export default function Navbar() {
    const pathname = useLocation().pathname;

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
        <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link to="/" className="font-bold text-xl">
                        TransApp
                    </Link>
                    <nav className={ `hidden md:flex gap-6` } >
                        { ! isAuthenticated ?
                            routes.map(route => (
                                <span className="disabled-link cursor-not-allowed">{route.label}</span>
                            ))
                            : routes.map((route) => (
                                <Link
                                    key={route.href}
                                    to={route.href}
                                    className={cn(
                                        `text-sm transition-colors hover:text-white`,
                                        pathname === route.href ? "text-white" : "text-zinc-400",
                                    )}

                                >
                                    {route.label}
                                </Link>
                            ))}
                    </nav>
                </div>

                <div className="flex items-center gap-3">
                    {
                        ! isAuthenticated ?
                            <div className="hidden md:flex gap-3">
                                <Button variant="default" onClick={handleLoginOpen}>
                                    Iniciar Sesión
                                </Button>
                                <Button variant="outline" className="border-zinc-700" onClick={handleRegisterOpen}>
                                    Registrarse
                                </Button>
                            </div>
                            :
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" alt="avatar" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                    }
                    <Sheet>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="outline" size="icon" className="bg-transparent border-zinc-800">
                                <Menu className="h-5 w-5"/>
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="bg-zinc-950 border-zinc-800">
                            <nav className="flex flex-col gap-4 mt-8">
                                {routes.map((route) => (
                                    <Link
                                        key={route.href}
                                        to={route.href}
                                        className={cn(
                                            "text-lg transition-colors hover:text-white",
                                            pathname === route.href ? "text-white" : "text-zinc-400",
                                        )}
                                    >
                                        {route.label}
                                    </Link>
                                ))}
                                <Button variant="default" className="mt-4" onClick={handleLoginOpen}>
                                    Iniciar Sesión
                                </Button>
                                <Button variant="outline" className="border-zinc-700"
                                        onClick={handleRegisterOpen}>
                                    Registrarse
                                </Button>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            <LoginModal open={loginOpen} onOpenChange={setLoginOpen} setRegisterOpen={setRegisterOpen}/>
            <RegisterModal open={registerOpen} onOpenChange={setRegisterOpen} setLoginOpen={setLoginOpen}/>
        </header>
    );
}

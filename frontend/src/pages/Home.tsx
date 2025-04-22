import { Button } from "@/components/ui/button";
import {useEffect, useState } from "react";
import RegisterModal from "@/components/organisms/register-modal.tsx";
import LoginModal from "@/components/organisms/login-modal.tsx";


export default function Home() {
    const [loginOpen, setLoginOpen] = useState(false)
    const [registerOpen, setRegisterOpen] = useState(false)

    useEffect(() => {
        const handleOpenLogin = () => {
            setLoginOpen(true)
        }

        const handleOpenRegister = () => {
            setRegisterOpen(true)
        }

        document.addEventListener("open-login", handleOpenLogin)
        document.addEventListener("open-register", handleOpenRegister)

        return () => {
            document.removeEventListener("open-login", handleOpenLogin)
            document.removeEventListener("open-register", handleOpenRegister)
        }
    }, [])

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8">
            <h1 className="text-4xl font-bold tracking-tight">Sistema de Transacciones</h1>
            <p className="text-lg text-gray-400 max-w-md text-center">
                Gestiona tus transacciones de manera sencilla y eficiente con nuestra plataforma.
            </p>
            <div className="flex gap-4">
                <Button variant="default" onClick={() => setLoginOpen(true)}>
                    Iniciar Sesión
                </Button>
                <Button variant="outline" className="border-zinc-700" onClick={() => setRegisterOpen(true)}>
                    Registrarse
                </Button>
            </div>

            <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
            <RegisterModal open={registerOpen} onOpenChange={setRegisterOpen} />
        </div>
    )
}
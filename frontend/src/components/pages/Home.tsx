import {useEffect, useState } from "react";
import RegisterModal from "@/components/templates/register-modal.tsx";
import LoginModal from "@/components/templates/login-modal.tsx";


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
                Gestiona tus transacciones de manera rápida y sencilla con nuestra plataforma.
            </p>
            <LoginModal open={loginOpen} onOpenChange={setLoginOpen} setRegisterOpen={setRegisterOpen} />
            <RegisterModal open={registerOpen} onOpenChange={setRegisterOpen} setLoginOpen={setLoginOpen} />
        </div>
    )
}
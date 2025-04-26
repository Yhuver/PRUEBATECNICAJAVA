import { useState } from "react";
import LoginModal from "@/components/organisms/auth/LoginModal.tsx";
import RegisterModal from "@/components/organisms/auth/RegisterModal.tsx";


export default function Home() {
    const [loginOpen, setLoginOpen] = useState(false)
    const [registerOpen, setRegisterOpen] = useState(false)

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
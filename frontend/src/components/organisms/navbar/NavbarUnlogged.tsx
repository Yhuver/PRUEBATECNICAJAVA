import {Button} from "@/components/ui/button.tsx";

type NavbarUnloggedProps = {
    handleLoginOpen: () => void;
    handleRegisterOpen: () => void;
}

export default function NavbarUnlogged({handleLoginOpen, handleRegisterOpen}: NavbarUnloggedProps) {
    return (
        <div className="hidden md:flex gap-3">
            <Button variant="default" onClick={handleLoginOpen}>
                Iniciar Sesión
            </Button>
            <Button variant="outline" className="border-zinc-700" onClick={handleRegisterOpen}>
                Registrarse
            </Button>
        </div>
    );
}
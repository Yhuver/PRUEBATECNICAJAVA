import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-white px-4 text-center">
            <h1 className="text-5xl font-bold mb-4">404</h1>
            <p className="text-xl mb-6">La página que estás buscando no existe.</p>
            <Link
                to="/home"
                className="text-sm bg-white text-zinc-900 font-medium px-4 py-2 rounded hover:bg-zinc-200 transition"
            >
                Volver al inicio
            </Link>
        </div>
    );
}
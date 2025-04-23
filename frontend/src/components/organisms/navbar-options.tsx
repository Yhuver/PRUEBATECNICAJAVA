import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils.ts";
import { useAuthContext } from "@/contexts/AuthContext.tsx";
import { APP_ROUTES } from "@/constants/routes.ts";

export default function NavbarOptions() {
    const {isAuthenticated} = useAuthContext();
    const pathname = useLocation().pathname;

    return (
        <nav className="hidden md:flex gap-6">
            {APP_ROUTES.map((route) =>
                isAuthenticated ? (
                    <Link
                        key={route.id}
                        to={route.href}
                        className={cn("text-sm transition-colors hover:text-white",
                                pathname === route.href ? "text-white" : "text-zinc-400")}>
                            {route.label}
                        </Link> )
                    : (
                        <span key={route.id} className="text-sm text-zinc-500 cursor-not-allowed opacity-50">
                            {route.label}
                        </span>
                    )
            )}
        </nav>
    )
}
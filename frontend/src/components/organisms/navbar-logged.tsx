import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import { useAuthContext } from "@/contexts/AuthContext.tsx";
import { useNavigate } from "react-router";
import { LogOutIcon } from "lucide-react";
import { HOME_ROUTE } from "@/constants/routes.ts";

export default function NavbarLogged() {

    const {logout} = useAuthContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate(HOME_ROUTE)
    }

    return (
        <Menubar className={"border-0"}>
            <MenubarMenu>
                <MenubarTrigger>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="default-avatar"/>
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </MenubarTrigger>
                <MenubarContent side={"bottom"} align={"end"}>
                    <MenubarItem className={"flex justify-between"} onClick={handleLogout}>
                        Cerrar sesión
                        <LogOutIcon/>
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
}
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { HOME_ROUTE, TRANSACTION_ROUTE } from "@/constants/routes.ts";
import Transaction from "@/components/pages/Transaction.tsx"
import NotFoundPage from "@/components/pages/NotFound.tsx";
import Navbar from "@/components/organisms/navbar.tsx";
import {Toaster} from "@/components/ui/sonner.tsx";
import Home from "@/components/pages/Home.tsx";
import './App.css'
import {useAuthContext} from "@/contexts/AuthContext.tsx";
import {JSX} from "react";

function App() {
    return (
        <div className="bg-black">
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Navigate to={HOME_ROUTE} replace />}/>
                    <Route path={HOME_ROUTE} element={<Home />} />
                    <Route path={TRANSACTION_ROUTE} element={
                        <ProtectedRoute>
                            <Transaction />
                        </ProtectedRoute>
                    } />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </BrowserRouter>
            <Toaster />
        </div>
    );
}

function ProtectedRoute({ children }: { children: JSX.Element }) {
    const { isAuthenticated } = useAuthContext();
    if (!isAuthenticated) {
        return <Navigate to={HOME_ROUTE} replace />;
    }
    return children;
}

export default App

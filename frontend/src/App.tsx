import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { HOME_ROUTE, TRANSACTION_ROUTE } from "@/constants/routes.ts";
import Transaction from "@/components/pages/Transaction.tsx"
import NotFoundPage from "@/components/pages/NotFound.tsx";
import {Toaster} from "@/components/ui/sonner.tsx";
import Home from "@/components/pages/Home.tsx";
import './App.css'
import {useAuthContext} from "@/contexts/AuthContext.tsx";
import {JSX} from "react";
import Navbar from "@/components/organisms/navbar/Navbar.tsx";
import {TransactionProvider} from "@/contexts/TransactionContext.tsx";
import {PuffLoader} from "react-spinners";
import {AuthProvider} from "@/contexts/AuthContext.tsx";

function App() {

    return (
        <div className="bg-black">
            <BrowserRouter>
                <AuthProvider>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Navigate to={HOME_ROUTE} replace />}/>
                        <Route path={HOME_ROUTE} element={<Home />} />
                        <Route path={TRANSACTION_ROUTE} element={
                            <ProtectedRoute>
                                <TransactionProvider>
                                    <Transaction />
                                </TransactionProvider>
                            </ProtectedRoute>
                        } />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </AuthProvider>
            </BrowserRouter>
            <Toaster />
        </div>
    );
}

function ProtectedRoute({ children }: { children: JSX.Element }) {
    const { loading, isAuthenticated } = useAuthContext();

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <PuffLoader size={50} color="#a0aec0" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to={HOME_ROUTE} replace />;
    }
    return children;
}

export default App

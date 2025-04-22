import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from "@/components/organisms/navbar.tsx";

import './App.css'
import Home from "@/components/pages/Home.tsx";
import Transaction from "@/components/pages/Transaction.tsx"

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/transactions" element={<Transaction />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App

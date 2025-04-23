import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from "@/components/organisms/navbar.tsx";

import './App.css'
import Home from "@/components/pages/Home.tsx";
import Transaction from "@/components/pages/Transaction.tsx"
import {AuthProvider} from "@/contexts/AuthContext.tsx";

function App() {

    return (
       <div className="bg-black">
           <AuthProvider>
               <BrowserRouter>
                   <Navbar />
                   <Routes>
                       <Route path="/" element={<Home />} />
                       <Route path="/transactions" element={<Transaction />} />
                   </Routes>
               </BrowserRouter>
           </AuthProvider>
       </div>
    );
}

export default App

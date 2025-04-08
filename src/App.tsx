import { Routes,Route } from "react-router-dom"
import Navbar from "./components/shared/navbar"
import Auth from "./pages/auth"
import { Toaster } from "./components/ui/sonner"
import React from "react"



const Dashboard = React.lazy(() => import('./pages/dashboard'));
const Home = React.lazy(() => import('./pages/home'));

function App() {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/auth" element={<Auth/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
      <Toaster position="top-center" />
      
    </div>
  )
}

export default App
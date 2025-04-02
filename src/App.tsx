import { Routes,Route } from "react-router-dom"
import Navbar from "./components/shared/navbar"
import Home from "./pages/home"
import Auth from "./pages/auth"




function App() {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/auth" element={<Auth/>} />
      </Routes>
      
    </div>
  )
}

export default App
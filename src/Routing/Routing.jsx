import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import SignUp from '../Components/SignUp/SignUp'
import Login from '../Components/Login/Login'
import Navbar from '../Components/Navbar/Navbar'
import Home from '../Pages/Home'

const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Routing

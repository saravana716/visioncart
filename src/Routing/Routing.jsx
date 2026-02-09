import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import SignUp from '../Components/SignUp/SignUp'
import Login from '../Components/Login/Login'
import Navbar from '../Components/Navbar/Navbar'
import Home from '../Pages/Home'
import ProductPage from '../Pages/ProductPage'
import ProductDetails from '../Pages/ProductDetails'

const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Routing

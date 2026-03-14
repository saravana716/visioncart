import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import SignUp from '../Components/SignUp/SignUp'
import Login from '../Components/Login/Login'
import Navbar from '../Components/Navbar/Navbar'
import Home from '../Pages/Home'
import ProductPage from '../Pages/ProductPage'
import ProductDetails from '../Pages/ProductDetails'
import Profile from '../Pages/Profile'
import VirtualTryOn from '../Pages/VirtualTryOn'
import HomeTryOn from '../Pages/HomeTryOn'
import BookSlot from '../Pages/BookSlot'
import Cart from '../Pages/Cart'
import Checkout from '../Pages/Checkout'
import OrderSuccess from '../Pages/OrderSuccess'
import Orders from '../Pages/Orders'

const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/virtual-try-on" element={<VirtualTryOn />} />
        <Route path="/home-try-on" element={<HomeTryOn />} />
        <Route path="/book-slot" element={<BookSlot />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Routing

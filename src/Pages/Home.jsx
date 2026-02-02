import React from 'react'
import Navbar from '../Components/Navbar/Navbar'
import Slider from '../Components/Slider/Slider'
import Discover from '../Components/Discover/Discover'
import TrendyCollection from '../Components/TrendyCollection/TrendyCollection'

const Home = () => {
  return (
    <>
    <Navbar/>
    <Slider/>
    <Discover/>
    <TrendyCollection/>
      <Discover/>
    <TrendyCollection/>
      <Discover/>
    <TrendyCollection/>
    </>
  )
}

export default Home
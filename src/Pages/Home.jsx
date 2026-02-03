import React from 'react'
import Navbar from '../Components/Navbar/Navbar'
import Slider from '../Components/Slider/Slider'
import Discover from '../Components/Discover/Discover'
import TrendyCollection from '../Components/TrendyCollection/TrendyCollection'
import ContactLens from '../Components/Contact/ContactLens'
import BookAppointment from '../Components/BookAppointment/BookAppointment'
import UserSlider from '../Components/Userslider/UserSlider'
import OurBrands from '../Components/Ourbrands/OurBrands'
import Footers from '../Components/Footer/Footers'

import MobileCategories from '../Components/MobileCategories/MobileCategories'

import MobileTryOn from '../Components/MobileTryOn/MobileTryOn'

const Home = () => {
  return (
    <div>
    <Navbar/>
    <Slider/>
    <MobileCategories />
    <Discover/>
    <TrendyCollection/>
      <ContactLens/>
    <TrendyCollection/>
      <BookAppointment/>
    <TrendyCollection/>
    <UserSlider/>
    <TrendyCollection/>
<OurBrands/>
<Footers/>
    </div>
  )
}

export default Home
import React, { useState, useEffect } from 'react'
import Navbar from '../Components/Navbar/Navbar'
import Slider from '../Components/Slider/Slider'
import Discover from '../Components/Discover/Discover'
import TrendyCollection from '../Components/TrendyCollection/TrendyCollection'
import ContactLens from '../Components/Contact/ContactLens'
import BookAppointment from '../Components/BookAppointment/BookAppointment'
import UserSlider from '../Components/Userslider/UserSlider'
import OurBrands from '../Components/Ourbrands/OurBrands'
import Footers from '../Components/Footer/Footers';
import RecentlyViewed from '../Components/RecentlyViewed/RecentlyViewed';
import MobileCategories from '../Components/MobileCategories/MobileCategories'
import NewsLetter from '../Components/NewsLetter/NewsLetter';
import { getCategories } from '../services/firestoreService'

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      const cats = await getCategories();
      setCategories(cats);
      setLoading(false);
    };
    fetchHomeData();
  }, []);

  return (
    <div>
      <Navbar/>
      <Slider/>
      <MobileCategories />
      <Discover/>
      
      {loading ? (
        <div style={{textAlign: 'center', padding: '50px', fontSize: '18px', color: 'var(--primary-color)'}}>
          Loading Visioncart Experience...
        </div>
      ) : (
        <>
          <RecentlyViewed />
          {/* Dynamically render category sections */}
          {categories.slice(0, 1).map(cat => (
            <TrendyCollection key={cat.id} title={`Premium ${cat.name}`} categoryName={cat.name}/>
          ))}
          
          <ContactLens/>
          
          {categories.slice(1, 2).map(cat => (
            <TrendyCollection key={cat.id} title={`Latest ${cat.name}`} categoryName={cat.name}/>
          ))}
          
          <BookAppointment/>
          
          {categories.slice(2).map((cat, index) => (
            <React.Fragment key={cat.id}>
              <TrendyCollection title={cat.name} categoryName={cat.name}/>
              {index === 0 && <UserSlider/>} 
            </React.Fragment>
          ))}
          
          {/* Ensure UserSlider is shown even if there are fewer than 3 dynamic categories after slice */}
          {categories.length < 3 && <UserSlider/>}
          <TrendyCollection />
          <NewsLetter />
        </>
      )}

      <OurBrands/>
      <Footers/>
    </div>
  )
}

export default Home
import React from 'react'
import sliderimg from "../../assets/sliderimg.png"
import "./Slider.css"
const Slider = () => {
  return (
    <>
    <div className='slider'>
        <div className='sliderleft'>
        <h1>Look <span>Better</span></h1>
        <h3>Find Your Perfect Eyewear. Try Before You Buy.</h3>
<div className='para'>
            <p>Experience frames instantly with our Virtual Try-On (Live AR + Photo Upload)</p>
        <p>and discover eyewear that fits your style perfectly.</p>
</div>
        <div className='sliderbtn'>
            <button className='sliderbtnleft'>Try Frames Virtually</button>
            <button className='sliderbtnright'>Shop Eyewear</button>
        </div>
        </div>
        <div className='sliderright'>
            <img src={sliderimg} alt="" />
        </div>
    </div>
    </>
  )
}

export default Slider
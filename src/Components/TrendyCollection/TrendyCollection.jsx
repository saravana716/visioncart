import React from 'react'
import "./TrendyCollection.css"
import PropCard from '../PropCard/PropCard'
import rateimg from "../../assets/star.png"
import colorimg from "../../assets/color.png"
import glass from "../../assets/eye.png"
import glass1 from "../../assets/eye.png"
import glass2 from "../../assets/eye.png"
const TrendyCollection = () => {
    const cardlist=[
        {
            id:1,
            title:"Visionkart Screen Glasses",
            price:"$29.00",
            mrpprice:"$209.00",
            img:glass,
                rating:rateimg,
                color:colorimg,
                ratingcount:1556,
                colorcount:25
        },
        {
            id:2,
            title:"Visionkart Blue Light Glasses",
            price:"$49.00",
            mrpprice:"$299.00",
            img:glass1,
                rating:rateimg,
                color:colorimg,
                ratingcount:1256,
                colorcount:15
        },
        {
            id:3,
            title:"Visionkart Anti Glare Glasses",
            price:"$39.00",
            mrpprice:"$249.00",
            img:glass2,
                rating:rateimg,
                color:colorimg,
                ratingcount:1756,
                colorcount:30
        },
          {
            id:1,
            title:"Visionkart Screen Glasses",
            price:"$29.00",
            mrpprice:"$209.00",
            img:glass,
                rating:rateimg,
                color:colorimg,
                ratingcount:1556,
                colorcount:25
        },
        {
            id:2,
            title:"Visionkart Blue Light Glasses",
            price:"$49.00",
            mrpprice:"$299.00",
            img:glass1,
                rating:rateimg,
                color:colorimg,
                ratingcount:1256,
                colorcount:15
        },
        {
            id:3,
            title:"Visionkart Anti Glare Glasses",
            price:"$39.00",
            mrpprice:"$249.00",
            img:glass2,
                rating:rateimg,
                color:colorimg,
                ratingcount:1756,
                colorcount:30
        },
      
          {
            id:1,
            title:"Visionkart Screen Glasses",
            price:"$29.00",
            mrpprice:"$209.00",
            img:glass,
                rating:rateimg,
                color:colorimg,
                ratingcount:1556,
                colorcount:25
        },
        {
            id:2,
            title:"Visionkart Blue Light Glasses",
            price:"$49.00",
            mrpprice:"$299.00",
            img:glass1,
                rating:rateimg,
                color:colorimg,
                ratingcount:1256,
                colorcount:15
        },
        {
            id:3,
            title:"Visionkart Anti Glare Glasses",
            price:"$39.00",
            mrpprice:"$249.00",
            img:glass2,
                rating:rateimg,
                color:colorimg,
                ratingcount:1756,
                colorcount:30
        },
      
          {
            id:1,
            title:"Visionkart Screen Glasses",
            price:"$29.00",
            mrpprice:"$209.00",
            img:glass,
                rating:rateimg,
                color:colorimg,
                ratingcount:1556,
                colorcount:25
        },
       
      


    ]
  return (
    <>
    <div className='trendymain'>
        <div className='trendymaintitle'>
            <h1>Premium Optical Frames</h1>
            <h1 style={{borderBottom: "1px solid black", paddingBottom: "2px", cursor: "pointer"}}>Shop Now</h1>
        </div>

 <div className='trendy'>
    <PropCard cardlist={cardlist}/>
    </div>
    </div>
   
    </>
  )
}

export default TrendyCollection
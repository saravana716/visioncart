import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaRegHeart } from "react-icons/fa";
import "./PropCard.css"
const PropCard = (props) => {
    const navigate = useNavigate();
    console.log("props",props);
    let carddata=props.cardlist
    console.log("checkdata",carddata);
    
    
  return (
    <>
 {carddata.map(function (data) {
    return(
           <div className='propcard' key={data.id} onClick={() => navigate(`/product/${data.id}`)} style={{cursor: 'pointer'}}>
        <div className='propcardimg'>
            <img src={data.img} alt="Prop" className='inimg1' />
           <div className='mycard'>
            <img src={data.img} alt="Prop" className='inimg'/>

                <FaRegHeart  className='hearticon'/>
            <div className="prop-buttons1">
             <button className='btn1'> + Add to card</button>
             <button className='btn2'>View</button>
            </div>
           </div>
        </div>
        <div className='propcontent'>
            <h5>{data.title}</h5>
            <p><img src={data.rating} alt="" /> ({data.ratingcount} reviews)</p>
            <div className='rate'>
                <h6>{data.price} <del>{data.mrpprice}</del></h6>
             <p><img src={data.color} alt="" /> {data.colorcount} +</p> 
            </div>
        </div>
    </div>
    )
 })}
    </>
  )
}

export default PropCard
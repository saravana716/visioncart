import React from 'react'
import "./PropCard.css"
const PropCard = (props) => {
    console.log("props",props);
    let carddata=props.cardlist
    console.log("checkdata",carddata);
    
    
  return (
    <>
 {carddata.map(function (data) {
    return(
           <div className='propcard' key={data.id}>
        <div className='propcardimg'>
            <img src={data.img} alt="Prop" />
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
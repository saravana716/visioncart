import React from 'react'
import "./ContactLens.css"
import discoverimg from "../../assets/discoverimg.png"
import card1 from "../../assets/card1.png"
import card2 from "../../assets/card2.png"
import card3 from "../../assets/card3.png"
import card4 from "../../assets/card4.png"

const ContactLens = () => {
    const list=[{
        id:1,
        name:"Spectacles",
        img:card1
    },
    {
        id:2,
        name:"Sunglasses",
        img:card2
    }
    ,{
        id:3,
        name:"Contact Lenses",
        img:card3
    },
    {
        id:4,
        name:"Computer Glasses",
        img:card4
    }
]
  return (
    <>
    <div className='contact'>
        <div className='discoverleft'>
            <h2>Contact Lens</h2>
            {/* <h1>Frames <img src={discoverimg} alt="Discover" /></h1> */}
            <h2>and Accessories</h2>
            <button>Explore More</button>
        </div>
        <div className='discoverright'>
            {list.map(function (data) {
                return(
                    <div className='DiscoverCard'>
                <div className='cardimg'>
                    <img src={data.img} alt={data.name} />
                </div>
                <button>{data.name}</button>
            </div>
                )
            })}
        </div>
    </div>
    </>
  )
}

export default ContactLens
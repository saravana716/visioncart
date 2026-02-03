import React from 'react'
import book from "../../assets/book.png"
import "./BookAppointment.css"
const BookAppointment = () => {
  return (
    <>
    <div className='book'>
        <div className='bookleft'>
        <h1>Try Before You Buy</h1>
       <div>
         <p>Instantly see how every frame suits your face with VisionKart’s Virtual Try-On. Choose. Try. Buy — all in seconds.</p>
       </div>
        <button>Try Frames Virtually</button>
        </div>
        <div className='bookright'>
            <img src={book} alt="Book" />
        </div>
    </div>
    </>
  )
}

export default BookAppointment
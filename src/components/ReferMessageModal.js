import React from 'react'
import Congrat from "../assets/images/🎂 🎁 🎉 🎈.png"

const ReferMessageModal = ({setRefer, referalMessage}) => {
  return (
    <div className='pop_up'>
      <div className='pop_card'>
        <img src={Congrat} alt=""/>
        <span onClick={() => setRefer(false)}>&times;</span>

        <h2>
          1 hour of FREE classes added to your package
        </h2>

        <p>
          {
            referalMessage === "refered_user" 
              ? "Welcome to Nao Now! We are grateful our friend referred you!"
              : "Thank you for referring friends to Nao Now!"
          }
        </p>
      </div>
    </div>
  )
}

export default ReferMessageModal

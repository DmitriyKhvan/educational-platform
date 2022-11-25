import React from 'react'
import Congrat from "../assets/images/🎂 🎁 🎉 🎈.png"

const ReferMessageModal = ({setRefer}) => {
  return (
    <div className='pop_up'>
      <div className='pop_card'>
        <img src={Congrat} alt=""/>
        <span onClick={() => setRefer(false)}>&times;</span>

        <h2>
          1 hour of FREE classes added to your package
        </h2>

        <p>
          Thank you for referring friends to Nao Now!
        </p>
      </div>
    </div>
  )
}

export default ReferMessageModal

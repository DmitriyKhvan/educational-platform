import '../assets/styles/referal.scss';

import React, { useEffect } from 'react';

import { useSelector } from 'react-redux';

import card from '../assets/images/card.png';
import email from '../assets/images/email.svg';
import facebook from '../assets/images/facebook.png';
import instagram from '../assets/images/instagram.png';
import linkedin from '../assets/images/linkedin.png';
import message from '../assets/images/message.svg';
import present from '../assets/images/present.png';
import viber from '../assets/images/viber.svg';
import videotut from '../assets/images/videoTut.png';
import whatsapp from '../assets/images/whatsapp.svg';
import Layout from '../components/Layout';

const SERVER_URL = process.env.REACT_APP_SERVER_URL
  ? process.env.REACT_APP_SERVER_URL
  : 'https://dev.naonow.contracollective.com'


const Referal = () => {

  const user = useSelector(state => state.users.user)
  useEffect(() => {
    localStorage.setItem('referal_code',user.referal_code)
  },[user.referal_code])
  console.log(user.referal_code)
  return (
    <Layout>
       <div className='referal-wrapper'>
        <h2 className='title'>Refer A Friend</h2>
        <div className='description'>Invite a friend to Nao Now and you both benefit.</div>
        <div className='main-section'>
            <div className='referal-blocks'>
              <div style={{marginTop: "53px"}} className='block'>
                <h4 className='block-title'> For You</h4>
                <span className='block-subtitle'>1 Hour Of Free Classes</span>
                <p className='block-content'>You will get 1 hour worth of free classes after your friend purchases with Nao Now.</p>
              </div>
              <div style={{marginTop: "34px"}} className='block'>
              <h4 className='block-title'> For You</h4>
                <span className='block-subtitle'>For Your Friend</span>
                <p className='block-content'>If your friend is a new student, they will get 1 hour worth of free classes added to their package.</p>
              </div>
            </div>
          <div className='link-block'>
            <span className='link-title'>Share Your Link</span>
            <p style={{color: '#6133AF', padding: "8px"}}>http://localhost:3000/signup?role=student&referalcode={user.referal_code}</p>
          </div>
        </div>
        <div className='share-block'>
        <div className='share-friend'>
          <h4 className='title'>Share your referral code with friends</h4>
          <span className='description'>Copy the link and share it via text, email or messenger.</span>
          <div className='inputWrap'>
          <input />
            <div className='buttons-block'>
            <button style={{padding: "7px 8px", background: "#6133AF", margin: "0 10px ", marginBottom:8, borderRadius: 4}}><img src={email}/></button>
            <button style={{padding: 0, background: "#fff", margin: "0 10px ", cursor: "pointer"}}><img src={message}/></button>
            <button style={{padding: 0,  background: "#fff", margin: "0 10px ", cursor: "pointer"}}><img src={whatsapp}/></button>
            <button style={{padding: 0,  background: "#fff", margin: "0 10px ", cursor: "pointer"}}><img src={viber}/></button>
            </div>
          </div>
        </div>
        <div className='share-network'>
        <h4 className='title'>Share the link with your network</h4>
          <span className='description'>Share your referral code on social media.</span>
          <div className='buttons'>
          <botton className='share-button'> <img style={{marginRight: "10px"}} alt='df' src={facebook}/> Share on Facebook</botton>  
          <botton className='share-button'> <img style={{marginRight: "10px"}} alt='df' src={instagram}/>Share on Instagram</botton>  
          <botton className='share-button'> <img style={{marginRight: "10px"}} alt='df' src={linkedin}/>Share on LinkedIn</botton>  
          </div>
        </div>

        <div className='share-friend'>
          <h4 className='title' style={{margin:"30px 0 20px 0"}}>How It Works</h4>
          <div style={{display: "flex", flexDirection: "row", margin: "12px 0"}}>
            <img src={present} style={{width: 31, height: 35, marginRight: 17}}/>
          <div>
          <h4 className='title'>Share your referral code with a friend</h4>
            <span className='description'>Copy the link above and share it with your friends or network.</span>
          </div>
          </div>
          <div style={{display: "flex", flexDirection: "row", margin: "12px 0"}}>
            <img src={card} style={{width: 35, height: 35, marginRight: 17,  }}/>
         <div>
         <h4 className='title'>Your friend buys lessons and gets 1 hour worth of free classes</h4>
          <span className='description'>If your friend is a new student, they will get 1 hour of free classes added to their package.</span>
         </div>
          </div>

          <div style={{display: "flex", flexDirection: "row", margin: "12px 0"}}>
            <img src={videotut} style={{width: 39, height: 32, marginRight: 17}}/>
          <h4 className='title'>You get 1 hour of free classes</h4>
          </div>
        </div>
        </div>
       </div>
    </Layout>
  )
}

export default Referal

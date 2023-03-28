import '../../assets/styles/referal.scss';

import React from 'react';

import { useSelector } from 'react-redux';

import card from '../../assets/images/card.png';
import email from '../../assets/images/email.svg';
import facebook from '../../assets/images/facebook.png';
import instagram from '../../assets/images/instagram.png';
import linkedin from '../../assets/images/linkedin.png';
import Message from '../../assets/images/message.svg';
import present from '../../assets/images/present.png';
import videotut from '../../assets/images/videoTut.png';
import whatsapp from '../../assets/images/whatsapp.svg';
import CloudMessage from '../../assets/images/Frame.png';
import Layout from '../../components/Layout';

import Congrat from "../../assets/images/🎂 🎁 🎉 🎈.png"

const SERVER_URL = process.env.REACT_APP_SERVER_URL
  ? process.env.REACT_APP_SERVER_URL
  : 'https://dev.naonow.contracollective.com'


const Referal = () => {
 
  const user = useSelector(state => state.users.user)

  const copyText = (link) => {
    navigator.clipboard.writeText(link)
    .then(() => {
        alert('Text copied to clipboard');
    })
    .catch(err => {
        console.error('Error in copying text: ', err);
    });
  }

  return (
    <Layout>
       <div className='referal-wrapper'>
          <h2 className='title'>Refer A Friend</h2>
          <div className='description'>Invite a friend to Nao Now and you both benefit.</div>
          <div className='main_section'>
            <div className='main_section-row'>
              <div className='left_side'>
                <div className='refer_card'>
                  <h2>For You</h2>
                  <p>1 Hour Of Free Classes</p>
                  <span>
                    You will get 1 hour worth of free classes after your friend purchases with Nao Now.
                  </span>
                </div>  
                <div className='refer_card'>
                  <h2>For Your Friend</h2>
                  <p>1 Hour Of Free Classes</p>
                  <span>
                    You will get 1 hour worth of free classes after your friend purchases with Nao Now.
                  </span>
                </div>  
              </div>
              <div className='right_side'>
                <div className='gift_banner'>
                  <div className='link_card'>
                    <h3>Share Your Link</h3>
                    <span onClick={() => copyText(`${window.location.origin}/referral/${user.referal_code}`)}>
                     {window.location.origin}<br />/referral/{user.referal_code}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='sociel_section'>
            <div className='sociel_title'>
              <h2>Share your referral code with friends</h2>
              <p>
               Copy the link and share it via text, email or messenger.
              </p>
            </div>

            <div className='share_link-input'>
              <div className='left_share'>
                <input 
                  type={"text"}
                  value={`${window.location.origin}/referral/${user.referal_code}`}
                />
                <span onClick={() => 
                  copyText(`${window.location.origin}/referral/${user.referal_code}`)}>Copy</span>
              </div>
              <div className='right_share'>
                <a href={`mailto:insertyouremail@gmail.com?subject=look at this website&body=Hi,I found this website and thought you might like it ${window.location.origin}/referral/${user.referal_code}`}>
                  <div>
                    <img src={email} alt="" />
                  </div>
                </a>
                <a href={`sms:phone number&body=Hi,I found this website and thought you might like it ${window.location.origin}/referral/${user.referal_code}`}>
                  <img src={Message} alt="" />
                </a>
                <a href={`https://wa.me/?text=Hi,I found this website and thought you might like it ${window.location.origin}/referral/${user.referal_code}`}>
                  <img src={whatsapp} alt="" />
                </a>
                <img src={CloudMessage} alt="" />
              </div>
            </div>
            <div className='share_title'>
              <h2>Share the link with your network</h2>
              <p>
                Share your referral code on social media.
              </p>
            </div>

            <div className='share_button'>
              <a href=''>
                <img src={facebook} alt=""/>
                Share on Facebook
              </a>
              <a>
                <img src={instagram} alt=""/>
                Share on Instagram
              </a>
              <a>
                <img src={linkedin} alt=""/>
                Share on LinkedIn
              </a>
            </div>

            <div className='share_info'>
              <h2>How It Works</h2>

              <div className='share_col'>
                <div className='share_list'>
                  <img src={present} alt=''/>

                  <div>
                    <h3>Share your referral code with a friend</h3>
                    <p>Copy the link above and share it with your friends or network.</p>
                  </div>
                </div>  
                <div className='share_list'>
                  <img src={card} alt=''/>

                  <div>
                    <h3>Your friend buys lessons and gets 1 hour worth of free classes</h3>
                    <p>If your friend is a new student, they will get 1 hour of free classes added to their package.</p>
                  </div>
                </div>  
                <div className='share_list'>
                  <img src={videotut} alt=''/>

                  <div>
                    <h3>You get 1 hour of free classes</h3>
                  </div>
                </div>  
              </div>
            </div>


            {/* <div className='pop_up'>
              <div className='pop_card'>
                <img src={Congrat} alt=""/>
                <span>&times;</span>

                <h2>
                  1 hour of FREE classes added to your package
                </h2>

                <p>
                  Thank you for referring friends to Nao Now!
                </p>
              </div>
              <div className='pop_card'>
                <img src={Congrat} alt=""/>
                <span>&times;</span>

                <h2>
                  1 hour of FREE classes added to your package
                </h2>

                <p>
                Welcome to Nao Now! We are grateful our friend referred you! 
                </p>
              </div>  
            </div> */}
          </div>
        </div>
    </Layout>
  )
}

export default Referal

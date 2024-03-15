import '../../../assets/styles/referal.scss';

import React from 'react';

import card from '../../../assets/images/card.png';
import email from '../../../assets/images/email.svg';
import facebook from '../../../assets/images/facebook.png';
import instagram from '../../../assets/images/instagram.png';
import linkedin from '../../../assets/images/linkedin.png';
import Message from '../../../assets/images/message.svg';
import present from '../../../assets/images/present.png';
import videotut from '../../../assets/images/videoTut.png';
import whatsapp from '../../../assets/images/whatsapp.svg';
import Layout from '../../../layouts/DashboardLayout';
import { useAuth } from '../../../modules/auth';
import { useTranslation } from 'react-i18next';

const Referal = () => {
  // const user = useSelector(state => state.users.user)
  const { user } = useAuth();
  const [t] = useTranslation('refer');

  const copyText = (link) => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        alert('Text copied to clipboard');
      })
      .catch((err) => {
        console.error('Error in copying text: ', err);
      });
  };

  return (
    <Layout>
      <div className="referal-wrapper">
        <h2 className="title">{t('refer')}</h2>
        <div className="description">{t('refer_desc')}</div>
        <div className="main_section">
          <div className="main_section-row">
            <div className="left_side">
              <div className="refer_card">
                <h2>{t('refer_from_title')}</h2>
                <p>{t('refer_card_subtitle')}</p>
                <span>{t('refer_card_desc')}</span>
              </div>
              <div className="refer_card">
                <h2>{t('refer_to_title')}</h2>
                <p>{t('refer_card_subtitle')}</p>
                <span>{t('refer_card_desc')}</span>
              </div>
            </div>
            <div className="right_side">
              <div className="gift_banner">
                <div className="link_card">
                  <h3>{t('share_link')}</h3>
                  <span
                    onClick={() =>
                      copyText(
                        `${window.location.origin}/referral/${user.referalCode}`,
                      )
                    }
                  >
                    {window.location.origin}/referral/{user.referalCode}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sociel_section">
          <div className="sociel_title">
            <h2>{t('share_title')}</h2>
            <p>{t('share_subtitle')}</p>
          </div>

          <div className="share_link-input">
            <div className="left_share">
              <input
                type={'text'}
                value={`${window.location.origin}/referral/${user.referalCode}`}
              />
              <span
                onClick={() =>
                  copyText(
                    `${window.location.origin}/referral/${user.referalCode}`,
                  )
                }
              >
                {t('copy_link')}
              </span>
            </div>
            <div className="right_share">
              <a
                href={`mailto:insertyouremail@gmail.com?subject=look at this website&body=Hi,I found this website and thought you might like it ${window.location.origin}/referral/${user.referalCode}`}
              >
                <div>
                  <img src={email} alt="" />
                </div>
              </a>
              <a
                href={`sms:phone number&body=Hi,I found this website and thought you might like it ${window.location.origin}/referral/${user.referalCode}`}
              >
                <img src={Message} alt="" />
              </a>
              <a
                href={`https://wa.me/?text=Hi,I found this website and thought you might like it ${window.location.origin}/referral/${user.referalCode}`}
              >
                <img src={whatsapp} alt="" />
              </a>
            </div>
          </div>
          <div className="share_title">
            <h2>{t('share_network')}</h2>
            <p>{t('share_network_subtitle')}</p>
          </div>

          <div className="share_button">
            <a href="">
              <img src={facebook} alt="" />
              {t('share_facebook')}
            </a>
            <a>
              <img src={instagram} alt="" />
              {t('share_instagram')}
            </a>
            <a>
              <img src={linkedin} alt="" />
              {t('share_linkedin')}
            </a>
          </div>

          <div className="share_info">
            <h2>{t('share_how')}</h2>

            <div className="share_col space-y-6">
              <div className="share_list">
                <img src={present} alt="" />

                <div>
                  <h3>{t('share_how_1_title')}</h3>
                  <p>{t('share_how_1_subtitle')}</p>
                </div>
              </div>
              <div className="share_list">
                <img src={card} alt="" />
                <div>
                  <h3>{t('share_how_2_title')}</h3>
                  <p>{t('share_how_2_subtitle')}</p>
                </div>
              </div>
              <div className="share_list">
                <img src={videotut} alt="" />
                <div>
                  <h3>{t('share_how_3_title')}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Referal;

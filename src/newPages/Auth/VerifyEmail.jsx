import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import NotificationManager from '../../components/NotificationManager';
import { emailVerify } from '../../actions/auth';
import { useTranslation } from 'react-i18next';
import Logo from '../../assets/images/auth-logo.svg';
import Email_insta from '../../assets/images/email_insta.svg';
import Email_butterfly from '../../assets/images/email_butterfly.svg';
import Email_Google from '../../assets/images/email_Google.svg';
import Email_in from '../../assets/images/email_in.svg';
import Email_facebook from '../../assets/images/email_facebook.svg';
import Email_image from '../../assets/images/verify_email-image.png';
const VerifyEmail = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [t] = useTranslation('common');
  const [verified, setVerified] = useState(false);
  useEffect(() => {
    async function tokenVerify(token) {
      let resp = await dispatch(emailVerify(token));
      setTimeout(() => {
        if (resp.type === 'AUTH_EMAIL_VERIFY_FAILURE') {
          setVerified(false);
          NotificationManager.error(t('email_verify_failed'), t);

          history.push('/signup');
        }
      }, 1000);
      setTimeout(() => {
        if (resp.type === 'AUTH_EMAIL_VERIFY_SUCCESS') {
          setVerified(true);
          NotificationManager.success(t('email_verify_success'), t);

          history.push('/');
        }
      }, 1000);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    tokenVerify(token);
  }, [dispatch, history]);

  return (
    <>
      {!verified && (
        <div className="auth-layout email_containers">
          <div className=" email_container email_backgrounds">
            <div className="main-logo">
              <img src={Logo} alt="" />
            </div>
            <div className="auth-form">
              <div className="email_title d-flex"></div>
              <div className="Email_image d-flex">
                <img
                  src={Email_image}
                  alt="Email_image"
                  className="Email_img"
                />
              </div>
              <div className="email_background">
                <div className="email_background_width">
                  <div className="email_image_para">
                    <span>{t('verifying_your_email')}</span>
                  </div>
                  <div className="email_border"></div>
                  <div className="d-flex email_img_order">
                    <img
                      src={Email_insta}
                      alt="Email_insta"
                      className="email_image_order "
                    />
                    <img
                      src={Email_facebook}
                      alt="Email_facebook"
                      className="email_image_order"
                    />
                    <img
                      src={Email_in}
                      alt="Email_in"
                      className="email_image_order"
                    />
                    <img
                      src={Email_Google}
                      alt="Email_Google"
                      className="email_image_order"
                    />
                    <img
                      src={Email_butterfly}
                      alt="Email_butterfly"
                      className="email_image_order"
                    />
                  </div>
                  <div>
                    <div className="email_image_paras">
                      {t('email_copy_para')}
                      <br />
                      {t('email_copy_para1')}
                    </div>
                  </div>
                  <div>
                    <div className="update_emails d-flex">
                      <div className="update_email">
                        {t('email_upadate_pre')}
                      </div>
                      <div className="update_email update_email_align ">|</div>
                      <div className="update_email">
                        {t('email_upadate_sub')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VerifyEmail;

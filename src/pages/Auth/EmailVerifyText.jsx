import { useTranslation } from 'react-i18next';
import Email_image from '../../assets/images/verify_email-image.png';
import Logo from '../../assets/images/auth-logo.svg';
import Email_insta from '../../assets/images/email_insta.svg';
import Email_butterfly from '../../assets/images/email_butterfly.svg';
import Email_Google from '../../assets/images/email_Google.svg';
import Email_in from '../../assets/images/email_in.svg';
import Email_facebook from '../../assets/images/email_facebook.svg';

const EmailVerifyText = () => {
  const [t] = useTranslation('common');
  return (
    <div className="auth-layout email_containers">
      <div className=" email_container email_backgrounds">
        <div className="main-logo">
          <img src={Logo} alt="" />
        </div>
        <div className="auth-form">
          <div className="email_title d-flex">{t('please_verify_email')}</div>
          <div className="Email_image d-flex">
            <img src={Email_image} alt="Email_image" className="Email_img" />
          </div>
        </div>

        <div className="email_background">
          <div className="email_background_width">
            <div className="email_image_para">
              <span>{t('sent_verification_email')}</span>
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
                <div className="update_email">{t('email_upadate_pre')}</div>
                <div className="update_email update_email_align ">|</div>
                <div className="update_email">{t('email_upadate_sub')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EmailVerifyText;

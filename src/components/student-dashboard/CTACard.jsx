import { Link } from 'react-router-dom';

const CTACard = ({ icon, title, subtitle, button, color, disabled }) => (
  <div
    style={{ background: color }}
    className={`page-card dash-card  ${title} ${
      disabled && 'disCard'
    } small-card flex-1 ms-0`}
  >
    <div className="p-0 container">
      <section className={`small-card-inline secblock`}>
        <div className="small-card-img-rounded">
          <img src={icon} alt="" className="img-fluid " />
        </div>
        <h3 className={`text-white`}>{title}</h3>
      </section>
      {button ? (
        <Link to={button.to} className='card-buttons'>
          {button.text}
        </Link>
      ) : null}
      {subtitle ? <p className="subtitle text-white">{subtitle}</p> : null}
    </div>
  </div>
);

export default CTACard;

import { Link } from 'react-router-dom'

const CTACard = ({ icon, title, subtitle, button, color }) => (
  <div className={`page-card ${color} small-card p-3 mx-3 ms-3`}>
    <div className='pt-3 pb-3 container'>
      <img src={icon} alt='' className='img-fluid w-15 mb-2' />
      <h3 className='text-white'>{title}</h3>
      {
        button
          ? <Link
              to={button.to}
              className='schedule-dashboard-buttons'
            >
              {button.text}
            </Link>
          : null
      }
      {
        subtitle
          ? <p className='subtitle text-white'>{subtitle}</p>
          : null
      }
    </div>
  </div>
)

export default CTACard

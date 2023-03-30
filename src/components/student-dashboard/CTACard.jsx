import { Link } from 'react-router-dom'

const CTACard = ({ icon, title, subtitle, button, color }) => (
  <div style={{background: color}} className={`page-card ${title} small-card  mx-4 ms-3`}>
    <div className='p-0 container'>
      <section className='small-card-inline'>
        <div className='small-card-img-rounded'>
          <img src={icon} alt='' className='img-fluid ' />
        </div>
        <h3 className='text-white'>{title}</h3>
      </section>
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

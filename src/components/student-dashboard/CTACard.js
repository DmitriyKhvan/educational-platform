import react from 'react'

const CTACard = ({ icon, title, subtitle, color }) => (
  <div className={`page-card ${color} small-card p-3 max-cta-card mx-3 ms-3`}>
    <div className='mt-3 container'>
      <img src={icon} alt='' className='img-fluid w-15 mb-2' />
      <h3 className='text-white'>{title}</h3>
      <p className='subtitle text-white'>{subtitle}</p>
    </div>
  </div>
)

export default CTACard

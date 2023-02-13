import 'rc-time-picker/assets/index.css'
import { useTranslation } from 'react-i18next'
import '../../../assets/styles/availability.scss'
import Layout from '../../../components/Layout'
import Availability from './Availability'
import AvailabilityView from './Content'
export const AvailiabilityLayout = () => {
  const [t] = useTranslation()
  return (
    <Layout>
      <Availability />
      {/* <div className='availability-layout'>
        <div className='scroll-layout'>
          <h4 className='main-title'>{t('my_availability')}</h4>
          <div className='scroll-layout'>
            <AvailabilityView />
          </div>
        </div>
      </div> */}
    </Layout>
  )
}

export default AvailiabilityLayout

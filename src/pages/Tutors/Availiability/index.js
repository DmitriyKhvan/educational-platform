import 'rc-time-picker/assets/index.css'
import Layout from '../../../components/Layout'
import AvailabilityView from './Content'
import { useTranslation } from 'react-i18next'

export const AvailiabilityLayout = () => {
  const [t, i18n] = useTranslation('translation')

  return (
    <Layout>
      <div className='availability-layout'>
        <div className='scroll-layout'>
          <h4 className='main-title'>{t('my_availability')}</h4>
          <div className='scroll-layout'>
            <AvailabilityView />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AvailiabilityLayout

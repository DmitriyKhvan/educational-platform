import 'rc-time-picker/assets/index.css'
import { useTranslation } from 'react-i18next'
import '../../../assets/styles/availability.scss'
import Layout from '../../../components/Layout'
import Availability from './Availability'
const AvailiabilityLayout = () => {
  const [t] = useTranslation()
  return (
    <Layout>
      <Availability />
    </Layout>
  )
}

export default AvailiabilityLayout

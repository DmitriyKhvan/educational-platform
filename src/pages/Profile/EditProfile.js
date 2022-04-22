import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import BasicInfoForm from '../../components/profile/BasicInfoForm'
import BiographyForm from '../../components/profile/BiographyForm'
import EducationForm from '../../components/profile/EducationForm'
import ProfileImage from '../../components/profile/ProfileImage'

const EditProfile = () => {
  const [t] = useTranslation()
  const border = { border: '1px solid #DEDEE1' }

  return (
    <Layout>
      <div className='flex-container children-wrapper pb-2'>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-8'>
              <h4 className='welcome-message'>{t('edit_profile')}</h4>
            </div>
            <div className='col-4'>
              <Link
                className='btn enter-btn'
                style={border}
                to='/tutor/profile'
              >
                View Profile
              </Link>
              {/* <div className='btn-group pt-2' role='group'>
                <button type='button' className='btn grey-border'>
                  <h5>
                    <strong>{t('basic_info')}</strong>
                  </h5>
                </button>
                <button type='button' className='btn grey-border'>
                  <h5>
                    <strong>{t('biography')}</strong>
                  </h5>
                </button>
                <button type='button' className='btn grey-border'>
                  <h5>
                    <strong>{t('education')}</strong>
                  </h5>
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
      <ProfileImage />
      <div className='form-section'>
        <div className='row ps-5'>
          <div className='col-6'>
            <BasicInfoForm />
            <BiographyForm />
            <EducationForm />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default EditProfile

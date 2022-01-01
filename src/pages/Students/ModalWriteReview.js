import { useState } from 'react'
import Modal from '../../components/Modal'
import '../../assets/styles/student.scss'
import { useTranslation } from 'react-i18next'
import { renderFormField } from '../../components/Global'
import { Avatar } from '../../components/Avatar'
import Stars from '../../components/Stars'
import ImgStarOutline from '../../assets/images/star_outline.svg'
import ImgStarFill from '../../assets/images/star_fill.svg'
import FavouriteIcon from '../../components/FavouriteIcon'
import { getAbbrName } from '../../constants/global'

const tutor = {
  name: 'Hudson Jaslyn',
  points: 0.7,
  isFavourite: false,
  major: 'MEDIA, CULTURE & BRANDING',
  avatar: 'preset_0'
}

const ModalWriteReview = ({ visible, onDismiss }) => {
  const [t, i18n] = useTranslation('translation')
  const [expand, setExpand] = useState(false)
  const [starIndex, setStarIndex] = useState(-1)
  const [formData, setFormData] = useState({
    review: ''
  })
  const [formDataError, setFormDataError] = useState({
    review: ''
  })
  const handleChange = (option, stateName) => {
    setFormData({ review: option })
  }

  return (
    <Modal
      className='modal-write-review'
      visible={visible}
      onCancel={onDismiss}
    >
      <p className='title'>{t('write_a_review')}</p>
      <div className='tutor-info'>
        <div>
          <Avatar avatar={tutor.avatar} />
          <div className='basic-info'>
            <div className='name-heart'>
              <p>{getAbbrName(tutor.first_name, tutor.last_name)}</p>
              <FavouriteIcon isFavourite={tutor.favorite} tutor_id={tutor.id} />
            </div>
            <div className='ratings'>
              <Stars points={tutor.points} />
              <span>({t('overall_ratings')})</span>
            </div>
            <p className='major'>{tutor.major}</p>
          </div>
        </div>
        <div className='btn outlined'>{t('see_profile')}</div>
      </div>
      <p className='p-write-review'>
        {t('write_review_tutor', { name: 'Sirena' })}
      </p>
      {renderFormField(
        'review',
        t(''),
        handleChange,
        formData,
        formDataError,
        'textfield',
        t('your_review_goes_here')
      )}
      <div className='footer'>
        <div>
          <span>{t('elevate_your_tutor')}</span>
          <div className='stars'>
            {[0, 1, 2, 3, 4].map((value, index) => (
              <img
                key={`img-${index}`}
                src={starIndex >= index ? ImgStarFill : ImgStarOutline}
                alt=''
                onClick={() => setStarIndex(index)}
              />
            ))}
          </div>
        </div>
        <div className='btn'>{t('submit')}</div>
      </div>
    </Modal>
  )
}

export default ModalWriteReview

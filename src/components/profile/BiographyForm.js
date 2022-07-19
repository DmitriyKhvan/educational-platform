import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import Filter from 'bad-words'
import { getTutorInfo, updateTutorInfo } from '../../actions/tutor'
import { getUserInfo } from '../../actions/user'
import NotificationManager from '../NotificationManager'

const BiographyForm = () => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const user = useSelector(state => state.users.user)
  const tutor = useSelector(state => state.tutor.info)
  const filter = new Filter({ placeHolder: 'x' })
  const [introduction, setIntroduction] = useState('')
  const [relevant_experience, setRelevantExperience] = useState('')
  const [unique_facts, setUniqueFacts] = useState('')

  useEffect(() => {
    dispatch(getUserInfo())
  }, [])

  useEffect(() => {
    if (user.tutor_profile?.id) {
      dispatch(getTutorInfo(user.tutor_profile?.id))
    }
  }, [user, dispatch])

  useEffect(() => {
    if (tutor) {
      setIntroduction(tutor.introduction)
      setRelevantExperience(tutor.relevant_experience)
      setUniqueFacts(tutor.unique_facts)
    }
  }, [tutor])

  const onClick = async () => {
    const res = await dispatch(
      updateTutorInfo({
        introduction: introduction.trim(),
        relevant_experience: relevant_experience.trim(),
        unique_facts: unique_facts.trim()
      })
    )

    if (res.type === 'UPDATE_TUTOR_INFO_FAILURE') {
      NotificationManager.error(t('update_tutor_failed'), t)
    }
  }

  return (
    <div>
      <div className='form-item-inner'>
        <h1>{t('biography')}</h1>
        <div className='mb-4'>
          <strong>{t('introduction')}</strong>
          <p>{t('introduction_subtitle')}</p>
          <textarea
            className='form-control'
            rows={6}
            onChange={e =>
              setIntroduction(
                e.target.value.length
                  ? filter.clean(e.target.value)
                  : e.target.value
              )
            }
            value={introduction}
          ></textarea>
          <p>{t('profile_word_count', { words: introduction.length })}</p>
        </div>

        <div className='mb-4'>
          <strong>{t('experience')}</strong>
          <p>{t('experience_subtitle')}</p>
          <textarea
            className='form-control'
            rows={6}
            onChange={e =>
              setRelevantExperience(
                e.target.value.length
                  ? filter.clean(e.target.value)
                  : e.target.value
              )
            }
            value={relevant_experience}
          ></textarea>
          <p>
            {t('profile_word_count', { words: relevant_experience.length })}
          </p>
        </div>

        <div className='mb-4'>
          <strong>{t('facts')}</strong>
          <p>{t('facts_subtitle')}</p>
          <textarea
            className='form-control'
            rows={6}
            onChange={e =>
              setUniqueFacts(
                e.target.value.length
                  ? filter.clean(e.target.value)
                  : e.target.value
              )
            }
            value={unique_facts}
          ></textarea>
          <p>{t('profile_word_count', { words: unique_facts.length })}</p>
        </div>

        <div className='mb-4 d-grid gap-2'>
          <button className='btn btn-primary' onClick={onClick}>
            {t('save_changes')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BiographyForm

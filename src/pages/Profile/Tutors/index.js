import { useEffect, useRef, useState } from 'react'
import Select from 'react-select'
import {
  DAYS,
  filterLessonsByStatus,
  getAbbrName,
  getAvatarName,
  introsteps,
  LANGUAGES,
  timezones
} from '../../../constants/global'
import TimePicker from 'rc-time-picker'
import 'rc-time-picker/assets/index.css'
import moment from 'moment'
import Modal from '../../../components/Modal'
import { useDispatch, useSelector } from 'react-redux'
import {
  getTutorInfo,
  updateTutorAvailability,
  updateTutorInfo
} from '../../../actions/tutor'

import { renderFormField, renderSelect } from '../../../components/Global'
import UploadVideo from '../../../components/UploadVideo'
import { useTranslation } from 'react-i18next'
import VimeoUpload from '../../../components/vimeo-upload'
import Vimeo from '@u-wave/react-vimeo'

import ImgChecked from '../../../assets/images/checked_sm.svg'
import ImgCollapse from '../../../assets/images/collapse.svg'
import ImgExtend from '../../../assets/images/extend.svg'
import CustomTable from '../../../components/CustomTable'
import { getAppointments } from '../../../actions/appointment'
import { Avatar } from '../../../components/Avatar'
import ModalEditStudentLesson from '../../Admin/ModalEditStudentLesson'
import Loader from 'react-spinners/ClipLoader'

const TutorProfile = ({ user, update, isAdmin, setDisabled }) => {
  const tutorInfo = useSelector(state => state.tutor.info)
  const dispatch = useDispatch()
  const [t, i18n] = useTranslation('translation')
  const [file, setFile] = useState(null)
  const [collapsed, setCollapsed] = useState(true)
  const [uploadProgress, setUploadProgress] = useState(-1)

  const [visibleEditLesson, setVisibleEditLesson] = useState(false)
  const [fupdate, setFupdate] = useState(false)
  const appointments = useSelector(state => state.appointment.list)
  const appointments_loading = useSelector(state => state.appointment.loading)
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [upcomingLessons, setUpcomingLessons] = useState([])
  const [pastLessons, setPastLessons] = useState([])
  const [formData, setFormData] = useState({
    major: '',
    language: '',
    university: '',
    checked: false,
    video_url: null
  })

  const [formDataError, setFormDataError] = useState({
    major: '',
    language: '',
    university: '',
    checked: '',
    video_url: ''
  })

  const onVideoUploadCompleted = e => {
    setFormData({ ...formData, video_url: `https://vimeo.com/${e}` })
    setUploadProgress(100)
    setTimeout(() => {
      fitVideo()
    }, 100)
    setDisabled(false)
  }

  const onVideoUploadProgress = e => {
    setUploadProgress(Math.ceil((e.loaded / e.total) * 100))
  }

  useEffect(() => {
    if (file) {
      var uploader = new VimeoUpload({
        file: file,
        name: file.name,
        description: 'Introduction Video',
        token: process.env.REACT_APP_VIMEO_AUTH_TOKEN,
        onComplete: onVideoUploadCompleted,
        onProgress: onVideoUploadProgress
      })
      setDisabled(true)
      uploader.upload()
    }
  }, [file])

  // Language
  const [selectedLanguage, setSelectedLanguage] = useState(
    LANGUAGES.map(lang => ({ value: lang.value, label: t(lang.label) })).find(
      lang => lang.value === formData?.language
    )
  )

  const handleChange = (option, stateName) => {
    const name = stateName.name
    if (name === 'language') {
      setFormDataError(formDataError => ({ ...formDataError, [name]: '' }))
      setFormData({ ...formData, [name]: option.value })
      setSelectedLanguage(option)
    } else {
      setFormDataError(formDataError => ({
        ...formDataError,
        [stateName]: ''
      }))
      setFormData({ ...formData, [stateName]: option })
    }
  }

  const fitVideo = () => {
    // List of Video Vendors embeds you want to support
    var players = ['iframe[src*="youtube.com"]', 'iframe[src*="vimeo.com"]']
    // Select videos
    var fitVids = document.querySelectorAll(players.join(','))
    // If there are videos on the page...
    if (fitVids.length) {
      // Loop through videos
      for (var i = 0; i < fitVids.length; i++) {
        // Get Video Information
        var fitVid = fitVids[i]
        var width = fitVid.getAttribute('width')
        var height = fitVid.getAttribute('height')
        var aspectRatio = height / width
        var parentDiv = fitVid.parentNode
        // Wrap it in a DIV
        var div = document.createElement('div')
        div.className = 'fitVids-wrapper'
        div.style.paddingBottom = aspectRatio * 100 + '%'
        parentDiv.insertBefore(div, fitVid)
        fitVid.remove()
        div.appendChild(fitVid)
        // Clear height/width from fitVid
        fitVid.removeAttribute('height')
        fitVid.removeAttribute('width')
      }
    }
  }

  // ===================================================
  useEffect(() => {
    if (appointments) {
      setUpcomingLessons(filterLessonsByStatus('upcoming', appointments))
      setPastLessons(filterLessonsByStatus('past', appointments))
    }
  }, [appointments])

  const columns = [
    {
      title: t('student_name'),
      dataKey: 'student',
      width: 20,
      render: (text, record) => (
        <div className='with-avatar'>
          <Avatar
            avatar={record.img}
            name={getAvatarName(record.first_name, record.last_name)}
          />
          <p>{getAbbrName(record.first_name, record.last_name)}</p>
        </div>
      )
    },
    {
      title: t('lesson_date'),
      dataKey: 'lessonDate',
      width: 20
    },
    {
      title: t('level'),
      dataKey: 'level',
      width: 20,
      render: item => <span>{t('level_n', { n: item ? item : 1 })}</span>
    },
    {
      title: t('lesson_topic'),
      dataKey: 'lessonType',
      width: 20,
      render: item => <p className='lesson-type'>{item}</p>
    }
  ]

  const columns_upcoming = [
    ...columns,
    {
      title: t('completed_lessons'),
      dataKey: 'completed',
      width: 20,
      render: (item, record) => {
        return (
          <div className='actions'>
            <a
              onClick={() => {
                setSelectedLesson(record)
                setVisibleEditLesson(true)
              }}
            >
              {t('reschedule')}
            </a>
          </div>
        )
      }
    }
  ]

  const columns_past = [
    ...columns,
    {
      title: t('where_left'),
      dataKey: 'completed',
      width: 20,
      render: (item, record) => (
        <div className='actions'>
          {record.completed ? (
            <span>{t('finished')}</span>
          ) : (
            <span>{t('unfinished')}</span>
          )}
        </div>
      )
    }
  ]

  // ===================================================

  useEffect(() => {
    if (user.tutor_profile?.id) {
      dispatch(getTutorInfo(user.tutor_profile.id))
    }
  }, [user])

  useEffect(() => {
    if (tutorInfo) {
      dispatch(getAppointments({ tutor_id: tutorInfo.id }))
      let formData_ = formData
      Object.keys(tutorInfo).map(key => {
        if (key !== 'availabilities' && key !== 'user') {
          formData_ = { ...formData_, [key]: tutorInfo[key] }
          if (key === 'language') {
            setSelectedLanguage(
              LANGUAGES.map(lang => ({
                value: lang.value,
                label: t(lang.label)
              })).find(lang => lang.value === formData_?.language)
            )
          }
          setTimeout(() => {
            fitVideo()
          }, 100)
        }
      })
      setFormData(formData_)
    }
    setFupdate(!fupdate)
  }, [tutorInfo])

  useEffect(() => {
    if (update) {
      updateProfile()
    }
  }, [update])

  // ===================================================

  const updateProfile = async () => {
    // const result = Object.keys(formData).map((key) => {
    //   if (key === 'checked') return true;
    //   return validateInput(formData[key], key);
    // })
    // const isInvalid = result.filter((r) => !r).length > 0;
    // if (isInvalid) {
    //   alert('incomplete')
    //   return;
    // }
    dispatch(updateTutorInfo({ ...formData, user_id: user?.id }))
  }

  

  return (
    <div className='profile-inner-wrapper'>
      <div className='form-section'>
        {renderFormField(
          'major',
          t('major'),
          handleChange,
          formData,
          formDataError
        )}
        {renderSelect(
          'language',
          t('language'),
          t('placeholder_select_your_language'),
          LANGUAGES.map(lang => ({
            value: lang.value,
            label: t(lang.label)
          })),
          selectedLanguage,
          handleChange,
          { required: t('error_select_an_option') },
          formDataError.language
        )}
        {renderFormField(
          'university',
          t('university'),
          handleChange,
          formData,
          formDataError
        )}

        <p className='section-title'>{t('introduce_yourself')}</p>
        <div className='introduce-wrapper'>
          {formData['video_url'] !== null && (
            <div className='uploaded'>
              <img src={ImgChecked} alt='' />
              <p>{t('video_uploaded')}</p>
            </div>
          )}
          <div
            className={
              'tip-wrapper ' +
              (formData['video_url'] === null ? '' : 'has-video')
            }
          >
            <div className='show-hide' onClick={() => setCollapsed(!collapsed)}>
              <p>
                {t(
                  collapsed
                    ? 'show_video_instructions'
                    : 'hide_video_instructions'
                )}
              </p>
              <img src={collapsed ? ImgExtend : ImgCollapse} alt='' />
            </div>
            {(!collapsed || formData['video_url'] === null) && (
              <>
                <div className='description'>
                  {t('intro_video_description')}{' '}
                  <strong>{t('intro_required')}</strong>
                </div>
                <div className='sub-title'>{t('helpful_tips')}</div>
                <div className='steps'>
                  {introsteps.map((intro, index) => (
                    <>
                      <div key={index}>
                        <span>{index + 1}</span>
                        <span>{t(intro)}</span>
                      </div>
                      {index < 3 && <div className='divider' />}
                    </>
                  ))}
                </div>
                <p className='see-intro-video'>
                  {t('see_intro_video_example')}
                </p>
              </>
            )}
          </div>
          {formData['video_url'] === null && (
            <UploadVideo
              id='upload-video-input'
              url={formData['video_url']}
              file={file}
              setFile={setFile}
              progress={uploadProgress}
            />
          )}
          {formData['video_url'] !== null && (
            <div
              className='uploaded-video'
              onClick={() => setFormData({ ...formData, video_url: null })}
            >
              {console.log('formData["video_url"]:', formData['video_url'])}
              <Vimeo
                video={formData['video_url']}
                width={560}
                height={315}
                onLoaded={() => console.log('Onloaded')}
              />
              {/* <Vimeo videoId="560885959" autoplay={true} /> */}
              <div className='btn-change-bio'>{t('change_bio')}</div>
            </div>
          )}
        </div>
      </div>

      {isAdmin && (
        <>
          <p className='section-title'>Upcoming Lessons</p>
          {appointments_loading ? (
            <Loader
              className='align-center'
              type='Audio'
              color='#00BFFF'
              height={50}
              width={50}
            />
          ) : (
            <CustomTable
              className='full-height'
              data={upcomingLessons}
              columns={columns_upcoming}
            />
          )}
          {/* <div className="btn-schedule-new-lesson">+ Add Lesson Time Slots</div> */}

          <p className='section-title'>Past Lessons</p>
          {appointments_loading ? (
            <Loader
              className='align-center'
              type='Audio'
              color='#00BFFF'
              height={50}
              width={50}
            />
          ) : (
            <CustomTable
              className='full-height'
              data={pastLessons}
              columns={columns_past}
            />
          )}
        </>
      )}

      {visibleEditLesson && (
        <ModalEditStudentLesson
          visible={visibleEditLesson}
          onDismiss={() => setVisibleEditLesson(false)}
          student={selectedLesson.student}
          date={new Date(selectedLesson.lessonDate)}
        />
      )}
    </div>
  )
}

export default TutorProfile

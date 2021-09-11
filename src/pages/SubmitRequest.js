import React, { useRef, useState } from 'react'
import Layout from '../components/Layout'
import '../assets/styles/dashboard.scss'
import { useTranslation } from 'react-i18next'

const SubmitRequest = () => {
  const [t, i18n] = useTranslation('translation')
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')

  const ref = useRef()
  const [dragOver, setDragOver] = useState(false)
  const [file, setFile] = useState(null)
  const [errorNotification, setErrorNotification] = useState(null)

  /**
    Drag and Drop Event Handlers
 **/
  const handleDragEnter = e => {
    e.preventDefault()
  }

  const handleDragOver = e => {
    e.preventDefault()
    if (!dragOver) {
      setDragOver(true)
    }
  }

  const handleDragLeave = e => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = e => {
    e.preventDefault()
    let file = e.dataTransfer.files[0]

    // Validate file is of type Image
    let fileType = file.type.split('/')[0]
    if (fileType !== 'video') {
      setErrorNotification(t('error_not_a_video_file'))
      setDragOver(false)

      return setTimeout(() => {
        setErrorNotification(null)
      }, 3000)
    }

    document.getElementById('submit_request_attachment').fileList =
      e.dataTransfer.files[0]
    setDragOver(false)
  }

  /**
     Handle Manually (File Input) Added Files
  **/
  const handleAddImage = async e => {
    e.preventDefault()
    let file = ref.current.files[0]
    if (!file) return
    // Validate file is of type Image
    let fileType = ref.current.files[0].type.split('/')[0]
    if (fileType !== 'video') {
      setErrorNotification(t('error_not_a_video_file'))
      // dragOverClass: ""
      return setTimeout(() => {
        setErrorNotification(null)
      }, 3000)
    }
  }

  return (
    <Layout>
      <div className="submit-request-layout">
        <h4 className="main-title">{t('submit_request')}</h4>
        <div className="divider" />
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer et
          justo metus. Nunc luctus justo quis lectus finibus scelerisque.
          Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
          posuere cubilia curae.
        </p>
        <div className="form-wrapper">
          <div className="form-row">
            <label>{t('subject')}</label>
            <input
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder={t('subject_your_question_request')}
            />
          </div>
          <div className="form-row">
            <label>{t('description')}</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder={t('description_your_question')}
            />
          </div>
          <div className="form-row">
            <label>{t('attachments')}</label>
            <div className="drag-drop">
              <input
                type="file"
                ref={ref}
                id={'submit_request_attachment'}
                className="drag-drop"
                accept="video/*"
                onDrop={e => handleDrop(e)}
                onDragEnter={e => handleDragEnter(e)}
                onDragOver={e => handleDragOver(e)}
                onDragLeave={e => handleDragLeave(e)}
                onChange={e => handleAddImage(e)}
              />
              {file ? (
                <div>
                  <h4>{file.name}</h4>
                  {/* {progress > -1 && progress < 100 && <p>{t('uploading')}{progress}%</p>} */}
                </div>
              ) : (
                <>
                  <span>{t('drop_file_here')}</span>
                  <span>{t('or')}</span>
                  <span>
                    <strong>{t('add_file')}</strong>
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="file-info-submit">
            <div>
              <span>{t('maximum_size')}</span>
              <span>{t('file_size_4mb')}</span>
            </div>
            <div className="btn-submit">{t('send')}</div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default SubmitRequest

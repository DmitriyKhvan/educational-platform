import React, { useState, useRef } from 'react'
import '../assets/styles/video_uploader.scss'
import { useTranslation } from 'react-i18next'

const UploadVideo = ({ url, file, setFile, id, progress }) => {
  const ref = useRef()
  const [t, i18n] = useTranslation('translation')
  const [dragOver, setDragOver] = useState(false)
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
      setFile(null)
      setErrorNotification(t('error_not_a_video_file'))
      setDragOver(false)

      return setTimeout(() => {
        setErrorNotification(null)
      }, 3000)
    }

    document.getElementById(id).fileList = e.dataTransfer.files[0]
    setFile(file)
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
      setFile(null)
      setErrorNotification(t('error_not_a_video_file'))
      // dragOverClass: ""
      return setTimeout(() => {
        setErrorNotification(null)
      }, 3000)
    }
    setFile(file)
  }

  return (
    <div className="upload-video">
      <div>
        <div
          className="btn"
          onClick={() => document.getElementById('upload-video-input').click()}
        >
          Upload
        </div>
      </div>
      <div className="drag-drop">
        <input
          type="file"
          ref={ref}
          id={id}
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
            {progress > -1 && progress < 100 && (
              <p>
                {t('uploading')}
                {progress}%
              </p>
            )}
          </div>
        ) : (
          <>
            <span>{t('or')}</span>
            <span>{t('drag_drop_file_here')}</span>
          </>
        )}
      </div>
    </div>
  )
}

export default UploadVideo

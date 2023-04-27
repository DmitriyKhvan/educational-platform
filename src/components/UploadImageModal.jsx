import React, { useState, useRef } from 'react';
import CloseIcon from '../assets/images/close.svg';
import SmileIcon from '../assets/images/smile.svg';
import '../assets/styles/image_uploader.scss';
import { useTranslation } from 'react-i18next';
import NotificationManager from './NotificationManager';
import { Avatar } from './Avatar';

const UploadImageModal = (props) => {
  const ref = useRef();
  const [t, i18n] = useTranslation('translation');
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [preset, setPreset] = useState(-1);
  const [errorNotification, setErrorNotification] = useState(null);
  /**
    Drag and Drop Event Handlers
 **/
  const handleDragEnter = (e) => {
    e.preventDefault();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!dragOver) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    let file = e.dataTransfer.files[0];

    // Validate file is of type Image
    let fileType = file.type.split('/')[0];
    if (fileType !== 'image') {
      setFile(null);
      setErrorNotification(t('error_not_an_image_file'));
      setDragOver(false);

      return setTimeout(() => {
        setErrorNotification(null);
      }, 3000);
    }

    document.getElementById('upload-image-input').fileList =
      e.dataTransfer.files[0];
    setFile(file);
    setDragOver(false);
  };

  /**
     Handle Manually (File Input) Added Files
  **/
  const handleAddImage = (e) => {
    e.preventDefault();
    let file = ref.current.files[0];
    if (!file) return;
    // Validate file is of type Image
    let fileType = ref.current.files[0].type.split('/')[0];
    if (fileType !== 'image') {
      setFile(null);
      setErrorNotification(t('error_not_an_image_file'));
      // dragOverClass: ""
      return setTimeout(() => {
        setErrorNotification(null);
      }, 3000);
    }

    setFile(file);
  };

  /**
    Handle Upload after Upload Button Clicked
  **/
  const handleUploadImage = (e) => {
    e.preventDefault();
    if (file === null && preset === -1) {
      NotificationManager.error(t('choose_file_or_preset'), t);
      return;
    }
    if (file === null) props.uploadImage(`preset_${preset}`, true);
    else props.uploadImage(file);
  };

  return (
    <div className="custom-upload-modal modal">
      <div className="modal-content">
        <div className="title-header">
          <h4 className="main-title">{t('upload_an_avatar')}</h4>
          <img src={CloseIcon} alt="" onClick={props.hideModal} />
        </div>
        <div className="divider" />
        <div className="image-uploader-wrapper">
          <div className={dragOver ? 'display-box drag-over' : 'display-box'}>
            <div className="icon-text-box">
              <div className="upload-text">
                {file ? (
                  <div>
                    <h4>{file.name}</h4>
                  </div>
                ) : (
                  <div className="main-text">
                    <p className="drop">{t('drop_an_image_here')}</p>
                    <p className="or">{t('or')}</p>
                    <p className="browser">{t('browse_for_an_image')}</p>
                  </div>
                )}
              </div>
              {errorNotification ? (
                <div className="error-notification">
                  <p>{errorNotification}</p>
                </div>
              ) : null}
            </div>
            <div>
              <input
                type="file"
                ref={ref}
                id="upload-image-input"
                className="upload-image-input"
                accept="image/*"
                onDrop={(e) => handleDrop(e)}
                onDragEnter={(e) => handleDragEnter(e)}
                onDragOver={(e) => handleDragOver(e)}
                onDragLeave={(e) => handleDragLeave(e)}
                onChange={(e) => handleAddImage(e)}
              />
            </div>
          </div>
        </div>
        <div className="choose-from-presets">
          <p>{t('choose_from_preset')}</p>
          <div className="presets">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
              <div
                key={`presets-${index}`}
                className={index === preset ? 'selected' : ''}
                onClick={() => setPreset(index)}
              >
                <Avatar avatar={'preset_' + index} />
              </div>
            ))}
          </div>
        </div>
        <div className="actions">
          <p>
            {t('ideal_image_size')} <img src={SmileIcon} alt="" /> 200x200px,
            png/jpeg
          </p>
          <div className="button-groups">
            <button
              className="submit-btn"
              onClick={(e) => handleUploadImage(e)}
            >
              {t('confirm')}
            </button>
            <button className="cancel-btn" onClick={props.hideModal}>
              {t('cancel')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadImageModal;

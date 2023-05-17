import React from 'react';
import { useParams } from 'react-router-dom';
import FavIcon from '../../assets/images/Favorite.png';

import './MentorsModal.scss';

const MentorsModal = ({
  setShowTutorModal,
  tutorId,
  tutorsList,
  handleStatusTutor,
}) => {
  const { id } = useParams();
  const [videoLink, setVideoLink] = React.useState('');

  const renderSelectedTutor = tutorsList?.find(
    (item) => item.id === (tutorId ? tutorId : id),
  );

  function renderVideo(videoUrl) {
    if (!videoUrl) {
      return;
    }
    const url = videoUrl?.split('');
    var yt = ['y', 'o', 'u', 't', 'u', 'b', 'e'];
    var codeURL = [];
    var isVideo = null;

    for (var i = 0; i < url?.length; i++) {
      if (yt.includes(url[i])) {
        isVideo = true;
        if (url.includes('=')) {
          for (var i = 0; i < url?.length; i++) {
            if (url[i] === '=') {
              codeURL = url.slice(i + 1);
            }
          }
        } else {
          codeURL = url?.slice(17);
        }
      } else {
        isVideo = false;
        codeURL = url?.slice(18);
      }
    }

    const prepareVideoToDB = codeURL.join('');
    var video = '';

    if (isVideo) {
      video = 'https://www.youtube.com/embed/' + prepareVideoToDB;
    } else {
      video = 'https://vimeo.com/' + prepareVideoToDB;
    }

    console.log(video)

    if (video) {
      setVideoLink(video);
    }
  }

  React.useEffect(() => {
    renderVideo(renderSelectedTutor?.videoUrl);
  }, [renderSelectedTutor]);

  return (
    <div className="tutor_alfa">
      <div className="tutor_modal">
        <p className="close-sh" onClick={() => setShowTutorModal(false)}>
          &times;
        </p>

        {
          videoLink?.length === 0 && (
            <div className='no_video'>
              <h2>No video!</h2>
            </div>
          )
        }

        {
          videoLink?.length !== 0 && (
            <iframe
              width="560"
              height="100%"
              src={videoLink}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ border: 0 }}
            ></iframe>
          )
        }

        <div className="tutor_more-content">
          {renderSelectedTutor?.isFavourite && (
            <img src={FavIcon} alt="" className="favTutorIcon" />
          )}
          <h1>{`${renderSelectedTutor?.user.firstName} ${renderSelectedTutor?.user.lastName}`}</h1>
          <p>{renderSelectedTutor?.about}</p>

          <div className="bottom_content">
            <div className="bottom_content-status">
              <div>
                <p>University</p>
                <h3>{renderSelectedTutor?.university}</h3>
              </div>
              <div>
                <p>Degree / Major</p>
                <h3>{renderSelectedTutor?.language}</h3>
              </div>
             
            </div>

            <div className="bottom_content-button">
              {/* <button onClick={() => setShowTutorModal(false)}>Cancel</button> */}
              {/* <button>Message</button> */}
              {/* <button onClick={() => handleStatusTutor(parseInt(tutorId))}>
                {renderSelectedTutor?.isFavourite ? 'Remove' : 'Favorite'}
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorsModal;

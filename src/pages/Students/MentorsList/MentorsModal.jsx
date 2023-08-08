import React from 'react';
import { useParams } from 'react-router-dom';
import FavIcon from '../../../assets/images/Favorite.png';

import './MentorsModal.scss';
import { renderVideo } from '../../../utils/functions';

const MentorsModal = ({ setShowTutorModal, tutorId, tutorsList }) => {
  const { id } = useParams();
  const [videoLink, setVideoLink] = React.useState('');

  const renderSelectedTutor = tutorsList?.find(
    (item) => item.id == (tutorId ? tutorId : id),
  );

  React.useEffect(() => {
    setVideoLink(renderVideo(renderSelectedTutor?.videoUrl) || '');
  }, [renderSelectedTutor]);

  return (
    <div className="tutor_alfa">
      <div className="tutor_modal">
        <p className="close-sh p-2" onClick={() => setShowTutorModal(false)}>
          &times;
        </p>

        {videoLink?.length === 0 && (
          <div className="no_video">
            <h2>No video!</h2>
          </div>
        )}

        {videoLink?.length !== 0 && (
          <iframe
            width="560"
            height="100%"
            src={videoLink}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ border: 0 }}
          ></iframe>
        )}

        <div className="tutor_more-content">
          {renderSelectedTutor?.isFavourite && (
            <img src={FavIcon} alt="" className="favTutorIcon" />
          )}
          <h1>{`${renderSelectedTutor?.user?.fullName}`}</h1>

          <div className="bottom_content">
            <div className="bottom_content-status">
              <div>
                <p>University</p>
                <h3>{renderSelectedTutor?.university}</h3>
              </div>
              <div>
                <p>Degree / Major</p>
                <h3>
                  {renderSelectedTutor?.degree}{' '}
                  {renderSelectedTutor.major
                    ? '/ ' + renderSelectedTutor.major
                    : null}
                </h3>
              </div>
            </div>
            <div className="modal_bio">
              {renderSelectedTutor?.introduction && (
                <div>
                  <p>Biography</p>
                  <span>{renderSelectedTutor?.introduction}</span>
                </div>
              )}

              {renderSelectedTutor?.relevantExperience && (
                <div>
                  <p>Relevant Experience</p>
                  <span>{renderSelectedTutor?.relevantExperience}</span>
                </div>
              )}

              {renderSelectedTutor?.uniqueFacts && (
                <div>
                  <p>Unique Facts</p>
                  <span>{renderSelectedTutor?.uniqueFacts}</span>
                </div>
              )}
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

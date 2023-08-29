import React from 'react';
import FavIcon from '../../../assets/images/Favorite.png';

import './MentorsModal.scss';
import { renderVideo } from '../../../utils/functions';
import { Avatar } from '../../../widgets/Avatar/Avatar';

const MentorsModal = ({ setShowMentorModal, mentor }) => {
  const [videoLink, setVideoLink] = React.useState('');

  React.useEffect(() => {
    setVideoLink(renderVideo(mentor?.videoUrl) || '');
  }, [mentor]);

  return (
    <div className="tutor_alfa">
      <div className="tutor_modal">
        <p className="close-sh pt-4" onClick={() => setShowMentorModal(false)}>
          &times;
        </p>

        {videoLink?.length === 0 && (
          <div className="no_video pl-4 py-4">
            <Avatar avatarUrl={mentor?.avatar?.url} />
          </div>
        )}

        {videoLink?.length !== 0 && (
          <iframe
            className="pl-4 py-4"
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
          {mentor?.isFavourite && (
            <img src={FavIcon} alt="" className="favTutorIcon" />
          )}
          <h1 className="mb-3">{`${
            mentor?.fullName || mentor?.user?.fullName
          }`}</h1>
          <div className="bottom_content">
            <div className="bottom_content-status">
              <div className="pb-3">
                <p className="p-0 m-0">University</p>
                <h3>{mentor?.university}</h3>
              </div>
              <div className="pb-3">
                <p className="p-0 m-0">Degree / Major</p>
                <h3>
                  {mentor?.degree} {mentor.major ? '/ ' + mentor.major : null}
                </h3>
              </div>
            </div>
            <div className="modal_bio">
              {mentor?.introduction && (
                <div className="py-3">
                  <p className="p-0 m-0">Biography</p>
                  <span>{mentor?.introduction}</span>
                </div>
              )}

              {mentor?.relevantExperience && (
                <div className="py-3">
                  <p className="p-0 m-0">Relevant Experience</p>
                  <span>{mentor?.relevantExperience}</span>
                </div>
              )}

              {mentor?.uniqueFacts && (
                <div className="py-3">
                  <p className="p-0 m-0">Unique Facts</p>
                  <span>{mentor?.uniqueFacts}</span>
                </div>
              )}
            </div>
            <div className="bottom_content-button">
              {/* <button onClick={() => setShowTutorModal(false)}>Cancel</button> */}
              {/* <button>Message</button> */}
              {/* <button onClick={() => handleStatusTutor(parseInt(tutorId))}>
                {mentor?.isFavourite ? 'Remove' : 'Favorite'}
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorsModal;

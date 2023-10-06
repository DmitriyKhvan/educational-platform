import React from 'react';
import ReactPlayer from 'react-player/file';

export const ZoomRecordingModal = ({ urlRecording }) => {
  return (
    <div>
      <ReactPlayer
        url={urlRecording}
        playing
        controls
        volume={0.8}
        width="100%"
        height="auto"
      />
    </div>
  );
};

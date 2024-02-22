import React from 'react';
import ReactPlayer from 'react-player/file';

export const ZoomRecordingModal = ({ urlRecording, width = '100%' }) => {
  return (
    <div>
      <ReactPlayer
        url={urlRecording}
        playing
        controls
        volume={0.8}
        width={width}
        height="auto"
      />
    </div>
  );
};

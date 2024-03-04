import React from 'react';
import ReactPlayer from 'react-player/file';

export const ZoomRecordingModal = ({ urlRecording, width = '100%' }) => {
  return (
    <div className="max-w-[456px] w-full mx-auto overflow-hidden rounded-lg mb-6">
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

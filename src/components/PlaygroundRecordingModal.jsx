import React from 'react';
import ReactPlayer from 'react-player/file';

export const PlaygroundRecordingModal = ({ urlRecording, width = '100%' }) => {
  return (
    <div
      className={`max-w-[${
        width === '100%' ? '456px' : width
      }] w-full mx-auto overflow-hidden rounded-lg mb-6`}
    >
      <ReactPlayer
        light
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

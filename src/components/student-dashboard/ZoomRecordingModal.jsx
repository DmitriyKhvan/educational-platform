import React from 'react';
import ReactPlayer from 'react-player/file';

export const ZoomRecordingModal = ({
  urlRecording = 'https://filesamples.com/samples/video/ogv/sample_640x360.ogv',
}) => {
  return (
    <div>
      <ReactPlayer
        url={urlRecording}
        // url="https://filesamples.com/samples/video/ogv/sample_640x360.ogv"
        playing
        controls
        volume={0.8}
        width="100%"
        height="auto"
      />
    </div>
  );
};

import React from 'react';
import ReactPlayer from 'react-player/file';

export const ZoomRecordingModal = ({
  // urlRecording = 'https://filesamples.com/samples/video/ogv/sample_640x360.ogv',
  urlRecording = 'https://storage.googleapis.com/naonow-dev/dashboard/recordings/8d69807968815ac497212d7a9282c12c.mp4',
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

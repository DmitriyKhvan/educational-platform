import { Host } from 'src/constants/global';

export const renderVideo = (videoUrl) => {
  const urlParams = new URL(videoUrl);

  if (urlParams.host === Host.YOUTUBE) {
  } else {
  }
};

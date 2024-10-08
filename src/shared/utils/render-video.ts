import { Host, VIMEO_EMBED, YOUTUBE_EMBED } from '@/shared/constants/global';

export const renderVideo = (videoUrl: string) => {
  const urlParams = new URL(videoUrl);
  const parts = urlParams.pathname.split('/');

  let videoId = parts[parts.length - 1];

  if (urlParams.host === Host.YOUTUBE) {
    const searchParams = new URLSearchParams(urlParams.search);
    if (searchParams.has('v')) {
      videoId = searchParams.get('v') as string;
    }

    return `${YOUTUBE_EMBED}/${videoId}`;
  }

  return `${VIMEO_EMBED}/${videoId}`;
};

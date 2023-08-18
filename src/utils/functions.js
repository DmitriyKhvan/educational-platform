const YOUTUBE_EMBED = 'https://www.youtube.com/embed/';
const VIMEO_EMBED = 'https://player.vimeo.com/video/';
const YOUTUBE_PREFIX = 'youtu';

export function renderVideo(videoUrl) {
    if (!videoUrl) {
      return;
    }
    const url = videoUrl?.split('');
    var codeURL = [];
    var isVideo = null;

    for (var i = 0; i < url.length; i++) {
      if (videoUrl.includes(YOUTUBE_PREFIX)) {
        isVideo = true;
        if (videoUrl.includes('shorts')) {
            if(url.includes('?')) {
                codeURL = url.slice(27, url.indexOf('?'))
            } else {
                codeURL = url.slice(31)
            }
        } else if (videoUrl.includes('live')) {
            codeURL = url.slice(29, url.indexOf('?'))
        }
        else if (url.includes('=')) {
            codeURL = url.slice(videoUrl.indexOf('=') + 1);
        } else {
          codeURL = url.slice(17);
        }
      } else {
        isVideo = false;
        codeURL = url.slice(18);
      }
    }

    const prepareVideoToDB = codeURL.join('');
    var video = '';

    if (isVideo) {
      video = YOUTUBE_EMBED + prepareVideoToDB;
    } else {
      video = VIMEO_EMBED + prepareVideoToDB;
    }

    if (video) {
       return video;
    }
  }

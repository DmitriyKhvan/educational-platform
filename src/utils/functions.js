const YOUTUBE_EMBED = 'https://www.youtube.com/embed/';
const VIMEO_EMBED = 'https://player.vimeo.com/video/';
const YOUTUBE_PREFIX = 'youtu';

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

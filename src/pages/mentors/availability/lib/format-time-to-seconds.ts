//converting time to seconds
export const formatTimeToSeconds = (time: string) => {
  if (time) {
    const [hours, minutes] = time.split(':');
    return Number(hours) * 60 * 60 + Number(minutes) * 60;
  }

  return 0;
};

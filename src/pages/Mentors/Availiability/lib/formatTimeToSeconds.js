//converting time to seconds
export const formatTimeToSeconds = (time) => {
  const [hours, minutes] = time.split(':');
  return parseInt(hours) * 60 * 60 + parseInt(minutes) * 60;
};

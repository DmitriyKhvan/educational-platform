//converting time to seconds
export const formatTimeToSeconds = (time) => {
  const [hours, minutes] = time.split(':');
  return Number.parseInt(hours) * 60 * 60 + Number.parseInt(minutes) * 60;
};

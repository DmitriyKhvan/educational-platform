export function getLessonsToScheduleCount(
  sessionsPerWeek,
  credits,
  numberOfMonthsToSchedule = 1,
) {
  const numberOfWeeksInMonth = 4;
  if (
    credits <
    sessionsPerWeek * numberOfWeeksInMonth * numberOfMonthsToSchedule
  ) {
    return Math.ceil(credits / sessionsPerWeek);
  }

  return numberOfWeeksInMonth * numberOfMonthsToSchedule;
}

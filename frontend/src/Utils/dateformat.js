function convertTo12HourTime(time24) {
  const [hours, minutes, seconds] = time24.split(":");
  const hour = parseInt(hours);
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const time12 = `${hour12}:${minutes} ${period}`;

  return time12;
}

export { convertTo12HourTime };

function getDaysBetweenDates(date1, date2) {
  // Convert both dates to milliseconds and find the absolute difference
  const differenceInTime = Math.abs(date2 - date1);
  
  // Convert the time difference from milliseconds to days
  const differenceInDays = differenceInTime / (1000 * 60 * 60 * 24);

  return parseInt(differenceInDays);
}

module.exports = {
  getDaysBetweenDates
}
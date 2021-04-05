export function convertLongDateToShort(object) {
    let date = object.date;
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    let day = date.substring(8, 10);
    let month = months[parseInt(date.substring(5, 7), 10) - 1].substring(0, 3);
    let year = date.substring(0, 4);
    return `${day}, ${month}, ${year}`;
  }
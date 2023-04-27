const currentTime = new Date();
console.log(currentTime);

const date =
  currentTime.getFullYear().toString() +
  "-" +
  (currentTime.getMonth() + 1).toString().padStart(2, "0") +
  "-" +
  currentTime.getDate().toString().padStart(2, "0");
console.log(date);

const time =
  currentTime.getHours().toString().padStart(2, "0") +
  ":" +
  (currentTime.getMinutes() + 1).toString().padStart(2, "0") +
  ":" +
  currentTime.getSeconds().toString().padStart(2, "0");
console.log(time);

console.log(currentTime.getTime());
const d = new Date("2023-04-26 19:45:00");
console.log(d.getTime());

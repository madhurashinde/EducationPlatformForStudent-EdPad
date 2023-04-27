export const validStr = (str) => {
  if (!str) return false;
  if (typeof str !== "string") return false;
  if (str.trim() === "") return false;
  return true;
};

export const validWeblink = (str) => {
  if (!validStr(str)) return false;
  const web = /^www\..+\.com$/;
  if (!web.test(str.trim())) return false;
  return true;
};

export const nonNegInt = (str) => {
  if (!validStr(str)) return false;
  const num = parseInt(str);
  if (num === NaN || num < 0) return false;
  return true;
};

const currentDate = () => {
  const currentTime = new Date();
  const date =
    currentTime.getFullYear().toString() +
    "-" +
    (currentTime.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    currentTime.getDate().toString().padStart(2, "0");
  return date;
};

const currentTime = () => {
  const currentTime = new Date();
  const time =
    currentTime.getHours().toString().padStart(2, "0") +
    ":" +
    (currentTime.getMinutes() + 1).toString().padStart(2, "0") +
    ":" +
    currentTime.getSeconds().toString().padStart(2, "0");
  return time;
};

export const validDueTime = (dueDate, dueTime) => {
  const due = new Date(dueDate + " " + dueTime);
  const current = new Date(currentDate() + " " + currentTime());
  return current.getTime() < due.getTime();
};

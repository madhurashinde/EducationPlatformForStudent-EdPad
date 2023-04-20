export const validStr = (str) => {
  if (!str) return false;
  if (typeof str !== "string") return false;
  if (str.trim() === "") return false;
  return true;
};

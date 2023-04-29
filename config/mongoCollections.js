import { dbConnection } from "./mongoConnection.js";

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

export const assignment = getCollectionFn("assignment");
export const courses_func = getCollectionFn("courses");
export const students = getCollectionFn('students');
export const faculty = getCollectionFn('faculty');
export const admin = getCollectionFn('admin');
export const announcements = getCollectionFn('announcements');
export const modules = getCollectionFn('modules');

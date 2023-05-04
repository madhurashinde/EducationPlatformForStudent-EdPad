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

export const assignment = getCollectionFn("assignmen");
export const course = getCollectionFn("course");
export const student = getCollectionFn("student");
export const faculty = getCollectionFn("faculty");
export const admin = getCollectionFn("admin");
export const announcement = getCollectionFn("announcement");
export const module = getCollectionFn("module");

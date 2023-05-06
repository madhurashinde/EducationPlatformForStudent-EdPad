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

export const user = getCollectionFn("user");
export const course = getCollectionFn("course");
export const announcement = getCollectionFn("announcement");
export const module = getCollectionFn("module");
export const assignment = getCollectionFn("assignment");
export const registration = getCollectionFn("registration");
export const major = getCollectionFn("major");

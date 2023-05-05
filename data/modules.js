import { module, course } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { validStr, validId, validWeblink } from "../helper.js";

const exportedMethods = {
  async get(id) {
    id = validId(id);
    const moduleCollection = await module();
    const moduleInfo = await moduleCollection.findOne({
      _id: new ObjectId(id),
    });
    if (moduleInfo === null) throw "No module with that id";
    moduleInfo._id = moduleInfo._id.toString();
    return moduleInfo;
  },

  async create(title, description, fileURL, courseId) {
    title = validStr(title);
    description = validStr(description);
    fileURL = validWeblink(fileURL);
    courseId = validId(courseId);

    const courseCollection = await course();
    const courseInfo = await courseCollection.findOne({
      _id: new ObjectId(courseId),
    });
    if (!courseInfo) throw "invalid course id";

    let newModule = {
      title: title,
      description: description,
      fileURL: fileURL,
      courseId: new ObjectId(courseId),
    };
    const moduleCollection = await module();
    const insertInfo = await moduleCollection.insertOne(newModule);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw "Could not add announcement";
    const newId = insertInfo.insertedId.toString();
    const ann = await this.get(newId);
    return ann;
  },

  async getAll(courseId) {
    courseId = validId(courseId);
    const courseCollection = await course();
    const courseInfo = await courseCollection.findOne({
      _id: new ObjectId(courseId),
    });
    if (!courseInfo) throw "invalid course id";

    const moduleCollection = await module();
    let moduleList = await moduleCollection
      .find({ courseId: new ObjectId(courseId) })
      .sort({ _id: -1 })
      .toArray();
    if (!moduleList) throw "Could not get all modules";
    moduleList = moduleList.map((element) => {
      element._id = element._id.toString();
      return element;
    });
    return moduleList;
  },

  async remove(id) {
    if (!id) throw "You must provide an id to search for";
    if (typeof id !== "string") throw "Id must be a string";
    if (id.trim().length === 0)
      throw "id cannot be an empty string or just spaces";
    id = id.trim();
    if (!ObjectId.isValid(id)) throw "invalid object ID";
    const moduleCollection = await module();
    const deletionInfo = await moduleCollection.findOneAndDelete({
      _id: new ObjectId(id),
    });

    if (deletionInfo.lastErrorObject.n === 0) {
      throw `Could not delete announcement with id of ${id}`;
    }
    let obj = {
      annId: deletionInfo.value._id,
      deleted: true,
    };
    return obj;
  },
};
export default exportedMethods;

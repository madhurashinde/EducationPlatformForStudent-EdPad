import { announcement, course } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { validStr, validId } from "../helper.js";

const exportedMethods = {
  async get(id) {
    id = validId(id);
    const annCollection = await announcement();
    const ann = await annCollection.findOne({ _id: new ObjectId(id) });
    if (ann === null) throw "No announcement with that id";
    ann._id = ann._id.toString();
    return ann;
  },

  async create(title, description, courseId) {
    title = validStr(title);
    description = validStr(description);
    courseId = validId(courseId);

    const courseCollection = await course();
    const courseInfo = await courseCollection.findOne({
      _id: new ObjectId(courseId),
    });
    if (!courseInfo) throw "invalid course id";
    let newAnn = {
      title: title,
      description: description,
      courseId: courseId,
      createdAt: new Date().toLocaleDateString(),
    };
    const annCollection = await announcement();
    const insertInfo = await annCollection.insertOne(newAnn);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw "Could not add announcement";
    const newId = insertInfo.insertedId.toString();
    const ann = await this.get(newId);
    return ann;
  },

  async getAll(courseId) {
    courseId = validId(courseId);
    const annCollection = await announcement();
    let annList = await annCollection
      .find({ courseId: courseId })
      .sort({ _id: -1 })
      .toArray();
    if (!annList) throw "Could not get all announcements";
    annList = annList.map((element) => {
      element._id = element._id.toString();
      return element;
    });
    return annList;
  },

  async remove(id) {
    id = validId(id);
    const annCollection = await announcement();
    const deletionInfo = await annCollection.findOneAndDelete({
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

  async getCourseId(id) {
    id = validId(id);
    const annCollection = await announcement();
    const annInfo = await annCollection.findOne(
      {
        _id: new ObjectId(id),
      },
      { projection: { courseId: 1 } }
    );
    if (annInfo === null) throw "can not find the announcement";
    const courseId = annInfo.courseId;
    return courseId;
  },
};

export default exportedMethods;
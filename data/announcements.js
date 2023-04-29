import {announcements} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import validation from '../helper.js';

const exportedMethods = {

  async get(id){
    if (!id) throw 'You must provide an id to search for';
    if (typeof id !== 'string') throw 'Id must be a string';
    if (id.trim().length === 0)
      throw 'Id cannot be an empty string or just spaces';
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'invalid object ID';
    const annCollection = await announcements();
    const ann = await annCollection.findOne({_id: new ObjectId(id)});
    if (ann === null) throw 'No band with that id';
    ann._id = ann._id.toString();
    return ann;
  },
  
  async create(
    title,
    user,
    description,
    course
  ){
    title = validation.checkString(title, 'Title');
    user = validation.checkString(user, 'UserId');
    description = validation.checkString(description, 'description');
    course = validation.checkId(course, 'Course ID');

    // let currentDate = new Date();
    // let cDay = currentDate.getDate();
    // let cMonth = currentDate.getMonth() + 1;
    // let cYear = currentDate.getFullYear();
    // let time = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
    // let createdAt="<b>" + cDay + "/" + cMonth + "/" + cYear + "</b>" + "  "+ time;

    let newAnn={
      title: title,
      user:user,
      description: description,
      course: course,
      createdAt: new Date().toLocaleDateString()
    }
    const annCollection= await announcements();
    const insertInfo = await annCollection.insertOne(newAnn);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw 'Could not add announcement';
    const newId = insertInfo.insertedId.toString();
    const ann = await this.get(newId);
    return ann;
  },

  async getAll(courseId){
    const annCollection= await announcements();
    let annList = await annCollection.find({course:courseId}).sort({'_id': -1}).toArray();
    if (!annList) throw 'Could not get all announcements';
    annList = annList.map((element) => {
      element._id = element._id.toString();
      return element;
    });
    return annList;
  },

  async remove(id){
    if (!id) throw 'You must provide an id to search for';
      if (typeof id !== 'string') throw 'Id must be a string';
      if (id.trim().length === 0)
        throw 'id cannot be an empty string or just spaces';
      id = id.trim();
      if (!ObjectId.isValid(id)) throw 'invalid object ID';
    const annCollection = await announcements();
    const deletionInfo = await annCollection.findOneAndDelete({
      _id: new ObjectId(id)
    });

    if (deletionInfo.lastErrorObject.n === 0) {
      throw `Could not delete announcement with id of ${id}`;
    }
    let obj={
      "annId": deletionInfo.value._id,
      "deleted": true 
    }
    return obj;
  }

};
export default exportedMethods;

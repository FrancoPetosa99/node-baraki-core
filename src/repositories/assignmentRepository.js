// repositories/AssignmentRepository.js
const mongoose = require('mongoose');
const Assignment = require('../models/assignment');

class AssignmentRepository {

  async create(data, { session } = {}) {
    const assignment = new Assignment(data);
    if (session) return assignment.save({ session });
    return assignment.save();
  }

  async findById(id, { populate = [] } = {}) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    let q = Assignment.findById(id);
    populate.forEach(p => q = q.populate(p));
    return q.lean().exec();
  }

  async findOne(filter = {}, { populate = [] } = {}) {
    let q = Assignment.findOne(filter);
    populate.forEach(p => q = q.populate(p));
    return q.lean().exec();
  }

  async find(filter = {}, { skip = 0, limit = 100, sort = { createdAt: -1 }, populate = [] } = {}) {
    let q = Assignment.find(filter)
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .sort(sort);
    populate.forEach(p => q = q.populate(p));
    return q.lean().exec();
  }

  async count(filter = {}) {
    return Assignment.countDocuments(filter).exec();
  }

  async updateById(id, update, { newDoc = true } = {}) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return Assignment.findByIdAndUpdate(id, update, { new: newDoc, runValidators: true }).lean().exec();
  }

  async deleteById(id, { session } = {}) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    // pass session in options to the query
    return Assignment.findByIdAndDelete(id, { session }).lean().exec();
  }

  async deleteMany(filter = {}) {
    return Assignment.deleteMany(filter).exec();
  }

  async findByEventAndEmployee(eventId, employeeId, { populate = [] } = {}) {
    if (!mongoose.Types.ObjectId.isValid(eventId) || !mongoose.Types.ObjectId.isValid(employeeId)) {
      return null;
    }
    return this.findOne({ event: eventId, employee: employeeId }, { populate });
  }

  async updateByEventAndEmployee(eventId, employeeId, update) {
    if (!mongoose.Types.ObjectId.isValid(eventId) || !mongoose.Types.ObjectId.isValid(employeeId)) {
      return null;
    }
    return Assignment.findOneAndUpdate(
      { event: eventId, employee: employeeId },
      update,
      { new: true, runValidators: true }
    ).lean().exec();
  }

  async deleteByEventAndEmployee(eventId, employeeId) {
    if (!mongoose.Types.ObjectId.isValid(eventId) || !mongoose.Types.ObjectId.isValid(employeeId)) {
      return null;
    }
    return Assignment.findOneAndDelete({
      event: eventId,
      employee: employeeId
    }).lean().exec();
  }

  async exists(eventId, employeeId) {
    if (!mongoose.Types.ObjectId.isValid(eventId) || !mongoose.Types.ObjectId.isValid(employeeId)) {
      return false;
    }
    const assignment = await Assignment.findOne({
      event: eventId,
      employee: employeeId
    }).select('_id').lean().exec();
    return !!assignment;
  }

  async findByEvent(eventId, { populate = [] } = {}) {
    if (!mongoose.Types.ObjectId.isValid(eventId)) return [];
    return this.find({ event: eventId }, { populate });
  }

  async findByEmployee(employeeId, { populate = [] } = {}) {
    if (!mongoose.Types.ObjectId.isValid(employeeId)) return [];
    return this.find({ employee: employeeId }, { populate });
  }
}

module.exports = new AssignmentRepository();
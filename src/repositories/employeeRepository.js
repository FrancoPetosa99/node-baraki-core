const mongoose = require('mongoose');
const Employee = require('../models/employee');

class EmployeeRepository {

  async create(data) {
    return Employee.create(data);
  }

  async findById(id, { populate = [] } = {}) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    let q = Employee.findById(id);
    populate.forEach(p => q = q.populate(p));
    return q.lean().exec();
  }

  async findOne(filter = {}, { populate = [] } = {}) {
    let q = Employee.findOne(filter);
    populate.forEach(p => q = q.populate(p));
    return q.lean().exec();
  }

  async find(filter = {}, { skip = 0, limit = 100, sort = { createdAt: -1 }, populate = [] } = {}) {
    let q = Employee.find(filter)
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .sort(sort);
    populate.forEach(p => q = q.populate(p));
    return q.lean().exec();
  }

  async count(filter = {}) {
    return Employee.countDocuments(filter).exec();
  }

  async updateById(id, update, { newDoc = true } = {}) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return Employee.findByIdAndUpdate(id, update, { new: newDoc, runValidators: true }).lean().exec();
  }

  async deleteById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return Employee.findByIdAndDelete(id).lean().exec();
  }

  async deleteMany(filter = {}) {
    return Employee.deleteMany(filter).exec();
  }

  async existsByPhone(phone, excludeId = null) {
    const filter = { phone };
    if (excludeId && mongoose.Types.ObjectId.isValid(excludeId)) {
      filter._id = { $ne: excludeId };
    }
    const employee = await Employee.findOne(filter).select('_id').lean().exec();
    return !!employee;
  }

  async search(searchTerm, { skip = 0, limit = 100 } = {}) {
    const filter = {
      $or: [
        { first_name: { $regex: searchTerm, $options: 'i' } },
        { last_name: { $regex: searchTerm, $options: 'i' } },
        { phone: { $regex: searchTerm, $options: 'i' } }
      ]
    };
    return this.find(filter, { skip, limit });
  }
}

module.exports = new EmployeeRepository();
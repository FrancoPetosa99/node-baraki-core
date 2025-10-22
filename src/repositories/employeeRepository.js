const Employee = require('../models/employee');
const mongoose = require('mongoose');

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
        let q = Employee.find(filter).skip(parseInt(skip)).limit(parseInt(limit)).sort(sort);
        populate.forEach(p => q = q.populate(p));
        return q.lean().exec();
    }

    async findByEmail(email, { populate = [] } = {}) {
        return this.findOne({ email }, { populate });
    }

    async findByIds(ids = [], { populate = [], skip = 0, limit = 100 } = {}) {
        const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));
        if (!validIds.length) return [];
        return this.find({ _id: { $in: validIds } }, { populate, skip, limit });
    }

    async updateById(id, update, { newDoc = true } = {}) {
        if (!mongoose.Types.ObjectId.isValid(id)) return null;
        return Employee.findByIdAndUpdate(id, update, { new: newDoc }).lean().exec();
    }

    async deleteById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) return null;
        return Employee.findByIdAndDelete(id).lean().exec();
    }

    async deleteMany(filter = {}) {
        return Employee.deleteMany(filter).exec();
    }
}

module.exports = new EmployeeRepository();
const Assignment = require('../models/assignment');
const mongoose = require('mongoose');

class AssignmentRepository {    
    async create(data) {
        return Assignment.create(data);
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
        let q = Assignment.find(filter).skip(parseInt(skip)).limit(parseInt(limit)).sort(sort);
        populate.forEach(p => q = q.populate(p));
        return q.lean().exec();
    }

    async findByEvent(eventId, { populate = ['employee'], skip = 0, limit = 100 } = {}) {
        return this.find({ event: eventId }, { populate, skip, limit });
    }

    async findByEmployee(employeeId, { populate = ['event'], skip = 0, limit = 100 } = {}) {
        return this.find({ employee: employeeId }, { populate, skip, limit });
    }

    async findByEventAndEmployee(eventId, employeeId, { populate = [] } = {}) {
        return this.findOne({ event: eventId, employee: employeeId }, { populate });
    }

    async updateById(id, update, { newDoc = true } = {}) {
        if (!mongoose.Types.ObjectId.isValid(id)) return null;
        return Assignment.findByIdAndUpdate(id, update, { new: newDoc }).lean().exec();
    }

    async deleteById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) return null;
        return Assignment.findByIdAndDelete(id).lean().exec();
    }

    async deleteMany(filter = {}) {
        return Assignment.deleteMany(filter).exec();
    }
    
    async upsertByEventAndEmployee(eventId, employeeId, data = {}) {
        const filter = { event: eventId, employee: employeeId };
        const update = { $set: data, $setOnInsert: { event: eventId, employee: employeeId } };
        const opts = { upsert: true, new: true };
        return Assignment.findOneAndUpdate(filter, update, opts).lean().exec();
    }
}

module.exports = new AssignmentRepository();
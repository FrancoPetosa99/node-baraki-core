const mongoose = require('mongoose');
const Event = require('../models/event');

class EventRepository {
    async create(data) {
        return Event.create(data);
    }

    async findById(id, { populate = [] } = {}) {
        if (!mongoose.Types.ObjectId.isValid(id)) return null;
        let q = Event.findById(id);
        populate.forEach(p => q = q.populate(p));
        return q.lean().exec();
    }

    async findOne(filter = {}, { populate = [] } = {}) {
        let q = Event.findOne(filter);
        populate.forEach(p => q = q.populate(p));
        return q.lean().exec();
    }

    async find(filter = {}, { skip = 0, limit = 100, sort = { createdAt: -1 }, populate = [] } = {}) {
        let q = Event.find(filter).skip(parseInt(skip)).limit(parseInt(limit)).sort(sort);
        populate.forEach(p => q = q.populate(p));
        return q.lean().exec();
    }

    async findByStatus(status, opts = {}) {
        return this.find({ status }, opts);
    }

    async findByDateRange(from, to, { skip = 0, limit = 100, populate = [] } = {}) {
        const filter = {};
        if (from || to) filter.date = {};
        if (from) filter.date.$gte = new Date(from);
        if (to) filter.date.$lte = new Date(to);
        return this.find(filter, { skip, limit, populate });
    }

    async updateById(id, update, { newDoc = true } = {}) {
        if (!mongoose.Types.ObjectId.isValid(id)) return null;
        return Event.findByIdAndUpdate(id, update, { new: newDoc }).lean().exec();
    }

    async deleteById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) return null;
        return Event.findByIdAndDelete(id).lean().exec();
    }

    async deleteMany(filter = {}) {
        return Event.deleteMany(filter).exec();
    }

    async addGuest(eventId, guest) {
        if (!mongoose.Types.ObjectId.isValid(eventId)) return null;
        const updated = await Event.findOneAndUpdate(
            { _id: eventId, 'confirmed_guests.email': { $ne: guest.email } },
            { $push: { confirmed_guests: guest } },
            { new: true }
        ).lean().exec();

        if (updated) return updated;
        return Event.findById(eventId).lean().exec();
    }

    async removeGuest(eventId, identifier) {
        if (!mongoose.Types.ObjectId.isValid(eventId)) return null;
        const isObjectId = mongoose.Types.ObjectId.isValid(identifier);
        const pull = isObjectId ? { _id: identifier } : { email: identifier };
        return Event.findByIdAndUpdate(
            eventId,
            { $pull: { confirmed_guests: pull } },
            { new: true }
        ).lean().exec();
    }

    async getGuests(eventId) {
        if (!mongoose.Types.ObjectId.isValid(eventId)) return null;
        const ev = await Event.findById(eventId).select('confirmed_guests').lean().exec();
        return ev ? ev.confirmed_guests : null;
    }

    async getInvitation(eventId) {
        if (!mongoose.Types.ObjectId.isValid(eventId)) return null;
        const ev = await Event.findById(eventId).select('invitation').lean().exec();
        return ev ? ev.invitation : null;
    }

    async addAssignment(eventId, assignmentId) {
        if (!mongoose.Types.ObjectId.isValid(eventId) || !mongoose.Types.ObjectId.isValid(assignmentId)) return null;
        return Event.findByIdAndUpdate(
            eventId,
            { $addToSet: { assignments: mongoose.Types.ObjectId(assignmentId) } },
            { new: true }
        ).lean().exec();
    }

    async removeAssignment(eventId, assignmentId) {
        if (!mongoose.Types.ObjectId.isValid(eventId) || !mongoose.Types.ObjectId.isValid(assignmentId)) return null;
        return Event.findByIdAndUpdate(
            eventId,
            { $pull: { assignments: mongoose.Types.ObjectId(assignmentId) } },
            { new: true }
        ).lean().exec();
    }
}

module.exports = new EventRepository();
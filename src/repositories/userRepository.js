const mongoose = require('mongoose');
const User = require('../models/user');

class UserRepository {
	async create(data) {
		return User.create(data);
	}

	async findById(id, { populate = [] } = {}) {
		if (!mongoose.Types.ObjectId.isValid(id)) return null;
		let q = User.findById(id);
		populate.forEach(p => (q = q.populate(p)));
		return q.lean().exec();
	}

	async findOne(filter = {}, { populate = [] } = {}) {
		let q = User.findOne(filter);
		populate.forEach(p => (q = q.populate(p)));
		return q.lean().exec();
	}

	async find(filter = {}, { skip = 0, limit = 100, sort = { createdAt: -1 }, populate = [] } = {}) {
		let q = User.find(filter)
			.skip(parseInt(skip))
			.limit(parseInt(limit))
			.sort(sort);
		populate.forEach(p => (q = q.populate(p)));
		return q.lean().exec();
	}

	async count(filter = {}) {
		return User.countDocuments(filter).exec();
	}

	async updateById(id, update, { newDoc = true } = {}) {
		if (!mongoose.Types.ObjectId.isValid(id)) return null;
		return User.findByIdAndUpdate(id, update, { new: newDoc, runValidators: true }).lean().exec();
	}

	async deleteById(id) {
		if (!mongoose.Types.ObjectId.isValid(id)) return null;
		return User.findByIdAndDelete(id).lean().exec();
	}

	async deleteMany(filter = {}) {
		return User.deleteMany(filter).exec();
	}

	async findByEmail(email, { populate = [] } = {}) {
		return this.findOne({ email }, { populate });
	}

	async existsByEmail(email, excludeId = null) {
		const filter = { email };
		if (excludeId && mongoose.Types.ObjectId.isValid(excludeId)) {
			filter._id = { $ne: excludeId };
		}
		const user = await User.findOne(filter).select('_id').lean().exec();
		return !!user;
	}
}

module.exports = new UserRepository();
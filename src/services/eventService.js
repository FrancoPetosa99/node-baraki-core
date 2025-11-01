const mongoose = require('mongoose');
const eventRepository = require('../repositories/EventRepository');
const assignmentRepository = require('../repositories/AssignmentRepository');

class EventService {
  // ============ VALIDATTION METHODS ============
  validateCreateEvent(data) {
    const errors = [];
    const { date, start_time, end_time, host, payment, invitation } = data;

    // Date validation
    if (!date) {
      errors.push('Event date is required');
    } else {
      const eventDate = new Date(date);
      if (isNaN(eventDate.getTime())) {
        errors.push('Invalid date format');
      }
      if (eventDate < new Date()) {
        errors.push('Event date cannot be in the past');
      }
    }

    // Time validation
    if (!start_time) {
      errors.push('Start time is required');
    }
    if (!end_time) {
      errors.push('End time is required');
    }
    if (start_time && end_time && start_time >= end_time) {
      errors.push('End time must be after start time');
    }

    // Host validation
    if (!host) {
      errors.push('Host information is required');
    } else {
      if (!host.first_name) errors.push('Host first name is required');
      if (!host.last_name) errors.push('Host last name is required');
      if (!host.email) errors.push('Host email is required');
      if (host.email && !this.isValidEmail(host.email)) {
        errors.push('Invalid host email format');
      }
      if (!host.phone) errors.push('Host phone is required');
    }

    // Payment validation
    if (!payment) {
      errors.push('Payment information is required');
    } else {
      if (payment.total_price === undefined || payment.total_price === null) {
        errors.push('Total price is required');
      }
      if (payment.total_price < 0) {
        errors.push('Total price cannot be negative');
      }
      if (payment.advanced_payment && payment.advanced_payment < 0) {
        errors.push('Advanced payment cannot be negative');
      }
      if (payment.advanced_payment > payment.total_price) {
        errors.push('Advanced payment cannot exceed total price');
      }
    }

    // Invitation validation
    if (!invitation) {
      errors.push('Invitation information is required');
    } else {
      if (!invitation.title) errors.push('Invitation title is required');
      if (invitation.title && invitation.title.length > 20) {
        errors.push('Invitation title must not exceed 20 characters');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validateGuest(guestData) {
    const errors = [];
    const { first_name, last_name, email } = guestData;

    if (!first_name || first_name.trim().length === 0) {
      errors.push('Guest first name is required');
    }
    if (first_name && first_name.length > 20) {
      errors.push('Guest first name must not exceed 20 characters');
    }

    if (!last_name || last_name.trim().length === 0) {
      errors.push('Guest last name is required');
    }
    if (last_name && last_name.length > 20) {
      errors.push('Guest last name must not exceed 20 characters');
    }

    if (!email) {
      errors.push('Guest email is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // ============ BUSINESS LOGIC METHODS ============
  async createEvent(eventData, userId) {
    const validation = this.validateCreateEvent(eventData);
    if (!validation.isValid) {
      throw {
        status: 400,
        message: 'Validation failed',
        errors: validation.errors
      };
    }

    const event = await eventRepository.create({
      ...eventData,
      user_id: userId,
      status: eventData.status || 'PENDING',
      confirmed_guests: [],
      assignments: []
    });

    return event;
  }

  async getEvent(eventId, userId) {
    const event = await eventRepository.findById(eventId, {
      populate: ['assignments']
    });

    if (!event) {
      throw {
        status: 404,
        message: 'Event not found'
      };
    }

    return event;
  }

  async searchEvents(filters, userId) {
    const {
      page = 1,
      limit = 10,
      status,
      date_from,
      date_to,
      search
    } = filters;

    const skip = (page - 1) * limit;
    let events;
    let filter = {};

    // Build filter
    if (status) {
      filter.status = status;
    }

    // Date range filter
    if (date_from || date_to) {
      events = await eventRepository.findByDateRange(date_from, date_to, {
        skip,
        limit: parseInt(limit),
        populate: ['assignments']
      });
    } else {
      // Search filter (host name or email)
      if (search) {
        filter.$or = [
          { 'host.first_name': { $regex: search, $options: 'i' } },
          { 'host.last_name': { $regex: search, $options: 'i' } },
          { 'host.email': { $regex: search, $options: 'i' } }
        ];
      }

      events = await eventRepository.find(filter, {
        skip,
        limit: parseInt(limit),
        sort: { date: -1 },
        populate: ['assignments']
      });
    }

    // Count total for pagination
    const Event = require('../models/event');
    const total = await Event.countDocuments(filter);

    return {
      events,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async updateEvent(eventId, updateData, userId) {
    const event = await eventRepository.findById(eventId);

    if (!event) {
      throw {
        status: 404,
        message: 'Event not found'
      };
    }

    // Validate update data if provided
    if (updateData.date || updateData.start_time || updateData.end_time || 
        updateData.host || updateData.payment || updateData.invitation) {
      const dataToValidate = {
        date: updateData.date || event.date,
        start_time: updateData.start_time || event.start_time,
        end_time: updateData.end_time || event.end_time,
        host: updateData.host || event.host,
        payment: updateData.payment || event.payment,
        invitation: updateData.invitation || event.invitation
      };

      const validation = this.validateCreateEvent(dataToValidate);
      if (!validation.isValid) {
        throw {
          status: 400,
          message: 'Validation failed',
          errors: validation.errors
        };
      }
    }

    // Update event using repository
    const updatedEvent = await eventRepository.updateById(eventId, updateData);

    if (!updatedEvent) {
      throw {
        status: 500,
        message: 'Failed to update event'
      };
    }

    return updatedEvent;
  }

  async deleteEvent(eventId, userId) {
    const event = await eventRepository.findById(eventId);

    if (!event) {
      throw {
        status: 404,
        message: 'Event not found'
      };
    }

    // Delete associated assignments
    if (event.assignments && event.assignments.length > 0) {
      await assignmentRepository.deleteMany({ 
        _id: { $in: event.assignments } 
      });
    }

    await eventRepository.deleteById(eventId);
    return { message: 'Event deleted successfully' };
  }

  // ============ GUEST MANAGEMENT ============

  async addGuest(eventId, guestData, userId) {
    const validation = this.validateGuest(guestData);
    if (!validation.isValid) {
      throw {
        status: 400,
        message: 'Validation failed',
        errors: validation.errors
      };
    }

    const guest = {
      first_name: guestData.first_name,
      last_name: guestData.last_name,
      email: guestData.email,
      assist: guestData.assist || false
    };

    const updatedEvent = await eventRepository.addGuest(eventId, guest);

    if (!updatedEvent) {
      throw {
        status: 404,
        message: 'Event not found'
      };
    }

    // Check if guest was actually added (not duplicate)
    const originalEvent = await eventRepository.findById(eventId);
    const guestExists = originalEvent.confirmed_guests.some(
      g => g.email === guest.email
    );

    if (!guestExists) {
      throw {
        status: 409,
        message: 'Guest with this email already exists'
      };
    }

    return updatedEvent;
  }

  async getEventGuests(eventId, userId) {
    const guests = await eventRepository.getGuests(eventId);

    if (guests === null) {
      throw {
        status: 404,
        message: 'Event not found'
      };
    }

    return guests;
  }

  async removeGuest(eventId, guestId, userId) {
    const updatedEvent = await eventRepository.removeGuest(eventId, guestId);

    if (!updatedEvent) {
      throw {
        status: 404,
        message: 'Event or guest not found'
      };
    }

    return { message: 'Guest removed successfully' };
  }

  // ============ EMPLOYEE & INVITATION METHODS ============

  async getEventEmployees(eventId, userId) {
    const event = await eventRepository.findById(eventId, {
      populate: [{
        path: 'assignments',
        populate: {
          path: 'employee_id',
          model: 'Employee'
        }
      }]
    });

    if (!event) {
      throw {
        status: 404,
        message: 'Event not found'
      };
    }

    const employees = event.assignments.map(assignment => ({
      ...assignment.employee_id,
      assignment: {
        role: assignment.role,
        status: assignment.status
      }
    }));

    return employees;
  }

  async getEventInvitation(eventId, userId) {
    const invitation = await eventRepository.getInvitation(eventId);

    if (invitation === null) {
      throw {
        status: 404,
        message: 'Event not found'
      };
    }

    // Get event details
    const event = await eventRepository.findById(eventId);

    return {
      invitation,
      event_details: {
        host: event.host,
        date: event.date,
        start_time: event.start_time,
        end_time: event.end_time
      }
    };
  }

  async addAssignment(eventId, assignmentData, userId) {
    // If caller passes an assignment id (string/ObjectId), just link it to the event
    if (typeof assignmentData === 'string' || mongoose.Types.ObjectId.isValid(assignmentData)) {
      const assignmentId = assignmentData;

      const event = await eventRepository.findById(eventId);
      if (!event) {
        throw {
          status: 404,
          message: 'Event not found'
        };
      }

      const updatedEvent = await eventRepository.addAssignment(eventId, assignmentId);
      if (!updatedEvent) {
        throw {
          status: 500,
          message: 'Failed to link assignment to event'
        };
      }

      return updatedEvent;
    }

    // Otherwise expect an object with employee field and create + link assignment
    if (!assignmentData || !assignmentData.employee) {
      throw {
        status: 400,
        message: 'Employee id is required for assignment'
      };
    }

    // Ensure event exists
    const event = await eventRepository.findById(eventId);
    if (!event) {
      throw {
        status: 404,
        message: 'Event not found'
      };
    }

    // Prevent duplicate assignment for same employee/event
    const exists = await assignmentRepository.exists(eventId, assignmentData.employee);
    if (exists) {
      throw {
        status: 409,
        message: 'Assignment for this employee already exists on the event'
      };
    }

    // Create assignment
    const newAssignment = await assignmentRepository.create({
      event: eventId,
      employee: assignmentData.employee,
      amount_paid: assignmentData.amount_paid || 0
    });

    if (!newAssignment) {
      throw {
        status: 500,
        message: 'Failed to create assignment'
      };
    }

    // Link assignment to event
    const updatedEvent = await eventRepository.addAssignment(eventId, newAssignment._id);
    if (!updatedEvent) {
      // attempt rollback: delete assignment
      await assignmentRepository.deleteById(newAssignment._id).catch(() => {});
      throw {
        status: 500,
        message: 'Failed to link assignment to event'
      };
    }

    // Return the created assignment (populated employee if needed)
    return assignmentRepository.findById(newAssignment._id, { populate: ['employee'] });
  }

  async removeAssignment(eventId, assignmentId, userId) {
    // Validate ids
    if (!mongoose.Types.ObjectId.isValid(eventId) || !mongoose.Types.ObjectId.isValid(assignmentId)) {
      throw {
        status: 400,
        message: 'Invalid event or assignment id'
      };
    }

    const event = await eventRepository.findById(eventId);
    if (!event) {
      throw {
        status: 404,
        message: 'Event not found'
      };
    }

    const updatedEvent = await eventRepository.removeAssignment(eventId, assignmentId);
    if (!updatedEvent) {
      throw {
        status: 500,
        message: 'Failed to remove assignment from event'
      };
    }

    return updatedEvent;
  }

  async removeAssignment(eventId, assignmentId, userId) {
    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      throw {
        status: 400,
        message: 'Invalid event ID'
      };
    }

    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      throw {
        status: 400,
        message: 'Invalid assignment ID'
      };
    }

    // Ensure event exists
    const event = await eventRepository.findById(eventId);
    if (!event) {
      throw {
        status: 404,
        message: 'Event not found'
      };
    }

    // Ensure assignment exists and belongs to event
    const assignment = await assignmentRepository.findById(assignmentId);
    if (!assignment) {
      throw {
        status: 404,
        message: 'Assignment not found'
      };
    }

    if (!assignment.event || String(assignment.event) !== String(eventId)) {
      throw {
        status: 400,
        message: 'Assignment does not belong to the specified event'
      };
    }

    // Remove assignment reference from event
    const updatedEvent = await eventRepository.removeAssignment(eventId, assignmentId);
    if (!updatedEvent) {
      throw {
        status: 500,
        message: 'Failed to remove assignment from event'
      };
    }

    return updatedEvent;
  }
}

module.exports = new EventService();
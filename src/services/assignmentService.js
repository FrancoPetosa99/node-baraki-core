// services/AssignmentService.js
const mongoose = require('mongoose');
const assignmentRepository = require('../repositories/AssignmentRepository');
const employeeService = require('./employeeService');
const eventService = require('./eventService');
const BadRequestException = require('../exceptions/BadRequestException');
const NotFoundException = require('../exceptions/NotFoundException');
const ConflictException = require('../exceptions/ConflictException');
const InternalServerExcepcion = require('../exceptions/InternalServerExcepcion');

class AssignmentService {
  // ============ VALIDATION METHODS ============

  validateCreateAssignment(data) {
    const errors = [];
    const { amount_paid } = data;

    // Amount paid validation
    if (amount_paid !== undefined && amount_paid !== null) {
      if (typeof amount_paid !== 'number') {
        errors.push('Amount paid must be a number');
      }
      if (amount_paid < 0) {
        errors.push('Amount paid cannot be negative');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validateUpdateAssignment(data) {
    const errors = [];
    const { amount_paid } = data;

    // Amount paid validation (if provided)
    if (amount_paid !== undefined && amount_paid !== null) {
      if (typeof amount_paid !== 'number') {
        errors.push('Amount paid must be a number');
      }
      if (amount_paid < 0) {
        errors.push('Amount paid cannot be negative');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // ============ BUSINESS LOGIC METHODS ============

  async createAssignment(eventId, employeeId, assignmentData, userId) {
    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      throw new BadRequestException('Invalid event ID');
    }

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      throw new BadRequestException('Invalid employee ID');
    }

    // Validate input data
    const validation = this.validateCreateAssignment(assignmentData);
    if (!validation.isValid) {
      throw new BadRequestException('Validation failed', validation.errors);
    }

    // Check if event exists using EventService
    try {
      await eventService.getEvent(eventId, userId);
    } catch (error) {
      throw new NotFoundException('Event not found');
    }

    // Check if employee exists using EmployeeService
    try {
      await employeeService.getEmployee(employeeId, userId);
    } catch (error) {
      throw new NotFoundException('Employee not found');
    }

    // Check if assignment already exists
    const existingAssignment = await assignmentRepository.exists(eventId, employeeId);
    if (existingAssignment) {
      throw new ConflictException('Assignment already exists for this event and employee');
    }

    // Create assignment
    const assignment = await assignmentRepository.create({
      event: eventId,
      employee: employeeId,
      amount_paid: assignmentData.amount_paid || 0
    });

    // Add assignment to event's assignments array
    await eventService.addAssignment(eventId, assignment._id);

    // Return assignment with populated data
    const populatedAssignment = await assignmentRepository.findById(assignment._id, {
      populate: ['event', 'employee']
    });

    return populatedAssignment;
  }

  async updateAssignment(eventId, employeeId, updateData, userId) {
    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      throw new BadRequestException('Invalid event ID');
    }

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      throw new BadRequestException('Invalid employee ID');
    }

    // Validate input data
    const validation = this.validateUpdateAssignment(updateData);
    if (!validation.isValid) {
      throw new BadRequestException('Validation failed', validation.errors);
    }

    // Verify event exists using EventService
    try {
      await eventService.getEvent(eventId, userId);
    } catch (error) {
      throw new NotFoundException('Event not found');
    }

    // Verify employee exists using EmployeeService
    try {
      await employeeService.getEmployee(employeeId, userId);
    } catch (error) {
      throw new NotFoundException('Employee not found');
    }

    // Check if assignment exists
    const assignment = await assignmentRepository.findByEventAndEmployee(eventId, employeeId);
    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    // Prepare update object
    const update = {};
    if (updateData.amount_paid !== undefined) {
      update.amount_paid = updateData.amount_paid;
    }

    // Update assignment
    const updatedAssignment = await assignmentRepository.updateByEventAndEmployee(
      eventId,
      employeeId,
      update
    );

    if (!updatedAssignment) {
      throw new InternalServerExcepcion('Failed to update assignment');
    }

    // Return with populated data
    const populatedAssignment = await assignmentRepository.findByEventAndEmployee(
      eventId,
      employeeId,
      { populate: ['event', 'employee'] }
    );

    return populatedAssignment;
  }

  async deleteAssignment(eventId, employeeId, userId) {
    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      throw new BadRequestException('Invalid event ID');
    }

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      throw {
        status: 400,
        message: 'Invalid employee ID'
      };
    }

    // Verify event exists using EventService
    try {
      await eventService.getEvent(eventId, userId);
    } catch (error) {
      throw new NotFoundException('Event not found');
    }

    // Verify employee exists using EmployeeService
    try {
      await employeeService.getEmployee(employeeId, userId);
    } catch (error) {
      throw new NotFoundException('Employee not found');
    }

    // Check if assignment exists
    const assignment = await assignmentRepository.findByEventAndEmployee(eventId, employeeId);
    if (!assignment) {
      throw {
        status: 404,
        message: 'Assignment not found'
      };
    }

    // Remove assignment from event's assignments array
    await eventService.removeAssignment(eventId, assignment._id);

    // Delete assignment
    await assignmentRepository.deleteByEventAndEmployee(eventId, employeeId);

    return { message: 'Assignment deleted successfully' };
  }

  async getAssignmentsByEvent(eventId, userId) {
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      throw {
        status: 400,
        message: 'Invalid event ID'
      };
    }

    // Verify event exists using EventService
    try {
      await eventService.getEvent(eventId, userId);
    } catch (error) {
      throw {
        status: 404,
        message: 'Event not found'
      };
    }

    const assignments = await assignmentRepository.findByEvent(eventId, {
      populate: ['employee']
    });

    return assignments;
  }

  async getAssignmentsByEmployee(employeeId, userId) {
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      throw new BadRequestException('Invalid employee ID');
    }

    // Verify employee exists using EmployeeService
    try {
      await employeeService.getEmployee(employeeId, userId);
    } catch (error) {
      throw new NotFoundException('Employee not found');
    }

    const assignments = await assignmentRepository.findByEmployee(employeeId, {
      populate: ['event']
    });

    return assignments;
  }
}

module.exports = new AssignmentService();
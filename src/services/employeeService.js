// services/EmployeeService.js
const mongoose = require('mongoose');
const employeeRepository = require('../repositories/EmployeeRepository');
const assignmentRepository = require('../repositories/AssignmentRepository');
const BadRequestException = require('../exceptions/BadRequestException');
const NotFoundException = require('../exceptions/NotFoundException');
const ConflictException = require('../exceptions/ConflictException');
const InternalServerExcepcion = require('../exceptions/InternalServerExcepcion');

class EmployeeService {
  // ============ VALIDATION METHODS ============

  validateCreateEmployee(data) {
    const errors = [];
    const { first_name, last_name, phone } = data;

    // First name validation
    if (!first_name || first_name.trim().length === 0) {
      errors.push('First name is required');
    }
    if (first_name && first_name.length > 20) {
      errors.push('First name must not exceed 20 characters');
    }

    // Last name validation
    if (last_name && last_name.length > 20) {
      errors.push('Last name must not exceed 20 characters');
    }

    // Phone validation
    if (!phone || phone.trim().length === 0) {
      errors.push('Phone is required');
    }
    if (phone && !this.isValidPhone(phone)) {
      errors.push('Invalid phone format');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validateUpdateEmployee(data) {
    const errors = [];
    const { first_name, last_name, phone } = data;

    // First name validation (if provided)
    if (first_name !== undefined) {
      if (first_name.trim().length === 0) {
        errors.push('First name cannot be empty');
      }
      if (first_name.length > 20) {
        errors.push('First name must not exceed 20 characters');
      }
    }

    // Last name validation (if provided)
    if (last_name !== undefined && last_name.length > 20) {
      errors.push('Last name must not exceed 20 characters');
    }

    // Phone validation (if provided)
    if (phone !== undefined) {
      if (phone.trim().length === 0) {
        errors.push('Phone cannot be empty');
      }
      if (!this.isValidPhone(phone)) {
        errors.push('Invalid phone format');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  isValidPhone(phone) {
    // Basic phone validation - adjust regex as needed
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  }

  // ============ BUSINESS LOGIC METHODS ============

  async createEmployee(employeeData, userId) {
    // Validate input
    const validation = this.validateCreateEmployee(employeeData);
    if (!validation.isValid) {
      throw new BadRequestException('Validation failed', validation.errors);
    }

    // Check if phone already exists
    const phoneExists = await employeeRepository.existsByPhone(employeeData.phone);
    if (phoneExists) {
      throw new ConflictException('Employee with this phone number already exists');
    }

    // Create employee
    const employee = await employeeRepository.create({
      first_name: employeeData.first_name.trim(),
      last_name: employeeData.last_name ? employeeData.last_name.trim() : undefined,
      phone: employeeData.phone.trim(),
      user_id: userId
    });

    return employee;
  }

  async getEmployee(employeeId, userId) {
    const employee = await employeeRepository.findById(employeeId);

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return employee;
  }

  async getEmployees(filters, userId) {
    const {
      page = 1,
      limit = 10,
      search
    } = filters;

    const skip = (page - 1) * limit;
    let employees;
    let total;

    if (search) {
      // Search by name or phone
      employees = await employeeRepository.search(search, {
        skip,
        limit: parseInt(limit)
      });
      // Count search results
      const Employee = require('../models/employee');
      total = await Employee.countDocuments({
        $or: [
          { first_name: { $regex: search, $options: 'i' } },
          { last_name: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } }
        ]
      });
    } else {
      // Get all employees
      employees = await employeeRepository.find({}, {
        skip,
        limit: parseInt(limit),
        sort: { createdAt: -1 }
      });
      total = await employeeRepository.count({});
    }

    return {
      employees,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async updateEmployee(employeeId, updateData, userId) {
    // Check if employee exists
    const employee = await employeeRepository.findById(employeeId);

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    // Validate update data
    const validation = this.validateUpdateEmployee(updateData);
    if (!validation.isValid) {
      throw new BadRequestException('Validation failed', validation.errors);
    }

    // Check if phone is being changed and if it already exists
    if (updateData.phone && updateData.phone !== employee.phone) {
      const phoneExists = await employeeRepository.existsByPhone(
        updateData.phone,
        employeeId
      );
      if (phoneExists) {
        throw new ConflictException('Phone number already in use by another employee');
      }
    }

    // Prepare update object
    const update = {};
    if (updateData.first_name !== undefined) {
      update.first_name = updateData.first_name.trim();
    }
    if (updateData.last_name !== undefined) {
      update.last_name = updateData.last_name ? updateData.last_name.trim() : '';
    }
    if (updateData.phone !== undefined) {
      update.phone = updateData.phone.trim();
    }

    // Update employee
    const updatedEmployee = await employeeRepository.updateById(employeeId, update);

    if (!updatedEmployee) {
      throw new InternalServerExcepcion('Failed to update employee');
    }

    return updatedEmployee;
  }

  async deleteEmployee(employeeId, userId) {
    const employee = await employeeRepository.findById(employeeId);

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    // Delete associated assignments
    await assignmentRepository.deleteMany({ employee_id: employeeId });

    // Delete employee
    await employeeRepository.deleteById(employeeId);

    return { message: 'Employee deleted successfully' };
  }

  async getEmployeeEvents(employeeId, userId) {
    const employee = await employeeRepository.findById(employeeId);

    if (!employee) {
      throw {
        status: 404,
        message: 'Employee not found'
      };
    }

    // Get all assignments for this employee
    const assignments = await assignmentRepository.find(
      { employee_id: employeeId },
      { populate: ['event_id'] }
    );

    // Map to events with assignment details
    const events = assignments.map(assignment => ({
      ...assignment.event_id,
      assignment: {
        role: assignment.role,
        status: assignment.status,
        assignment_id: assignment._id
      }
    }));

    return events;
  }
}

module.exports = new EmployeeService();
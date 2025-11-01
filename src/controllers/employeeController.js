const employeeService = require('../services/employeeService');

class EmployeeController {

  async createEmployee(req, res) {
    try {
      const employee = await employeeService.createEmployee(req.body, req.user._id);

      res.status(201).json({
        success: true,
        message: 'Employee created successfully',
        data: employee
      });
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({
        success: false,
        message: error.message || 'Failed to create employee',
        errors: error.errors || undefined
      });
    }
  }

  async getEmployees(req, res) {
    try {
      const result = await employeeService.getEmployees(req.query, req.user._id);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({
        success: false,
        message: error.message || 'Failed to get employees'
      });
    }
  }

  async getEmployee(req, res) {
    try {
      const employee = await employeeService.getEmployee(req.params.id, req.user._id);

      res.status(200).json({
        success: true,
        data: employee
      });
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({
        success: false,
        message: error.message || 'Failed to get employee'
      });
    }
  }

  async getEmployeeEvents(req, res) {
    try {
      const events = await employeeService.getEmployeeEvents(req.params.id, req.user._id);

      res.status(200).json({
        success: true,
        data: events
      });
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({
        success: false,
        message: error.message || 'Failed to get employee events'
      });
    }
  }

  async updateEmployee(req, res) {
    try {
      const employee = await employeeService.updateEmployee(
        req.params.id,
        req.body,
        req.user._id
      );

      res.status(200).json({
        success: true,
        message: 'Employee updated successfully',
        data: employee
      });
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({
        success: false,
        message: error.message || 'Failed to update employee',
        errors: error.errors || undefined
      });
    }
  }

  async deleteEmployee(req, res) {
    try {
      const result = await employeeService.deleteEmployee(req.params.id, req.user._id);

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({
        success: false,
        message: error.message || 'Failed to delete employee'
      });
    }
  }
}

module.exports = new EmployeeController();
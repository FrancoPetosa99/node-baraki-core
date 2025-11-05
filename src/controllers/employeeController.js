const employeeService = require('../services/employeeService');

class EmployeeController {
  async createEmployee(req, res, next) {
    try {
      const employee = await employeeService.createEmployee(req.body, req.user._id);

      res.status(201).json({
        success: true,
        message: 'Employee created successfully',
        data: employee
      });
    } catch (error) {
      return next(error);
    }
  }

  async getEmployees(req, res, next) {
    try {
      const result = await employeeService.getEmployees(req.query, req.user._id);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      return next(error);
    }
  }

  async getEmployee(req, res, next) {
    try {
      const employee = await employeeService.getEmployee(req.params.id, req.user._id);

      res.status(200).json({
        success: true,
        data: employee
      });
    } catch (error) {
      return next(error);
    }
  }

  async getEmployeeEvents(req, res, next) {
    try {
      const events = await employeeService.getEmployeeEvents(req.params.id, req.user._id);

      res.status(200).json({
        success: true,
        data: events
      });
    } catch (error) {
      return next(error);
    }
  }

  async updateEmployee(req, res, next) {
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
      return next(error);
    }
  }

  async deleteEmployee(req, res, next) {
    try {
      const result = await employeeService.deleteEmployee(req.params.id, req.user._id);

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new EmployeeController();
const assignmentService = require('../services/assignmentService');

class AssignmentController {
  async createAssignment(req, res, next) {
    try {
      const { event_id, employee_id } = req.params;
      
      const assignment = await assignmentService.createAssignment(event_id, employee_id);

      res.status(201).json({
        success: true,
        message: 'Assignment created successfully',
        data: assignment
      });
    } catch (error) {
      return next(error);
    }
  }

  async updateAssignment(req, res, next) {
    try {
      const { event_id, employee_id } = req.params;
      
      const assignment = await assignmentService.updateAssignment(
        event_id,
        employee_id,
        req.body,
        req.user._id
      );

      res.status(200).json({
        success: true,
        message: 'Assignment updated successfully',
        data: assignment
      });
    } catch (error) {
      return next(error);
    }
  }

  async deleteAssignment(req, res, next) {
    try {
      const { event_id, employee_id } = req.params;
      
      await assignmentService.deleteAssignment(event_id, employee_id);

      res.status(200).json({
        success: true,
        message: 'Assignment successfully deleted'
      });
    } catch (error) {
      return next(error);
    }
  }

  async getAssignmentsByEvent(req, res, next) {
    try {
      const { event_id } = req.params;
      
      const assignments = await assignmentService.getAssignmentsByEvent(
        event_id,
        req.user._id
      );

      res.status(200).json({
        success: true,
        message: 'Assignments retrieved successfully',
        data: assignments
      });
    } catch (error) {
      return next(error);
    }
  }

  async getAssignmentsByEmployee(req, res, next) {
    try {
      const { employee_id } = req.params;
      
      const assignments = await assignmentService.getAssignmentsByEmployee(employee_id);

      res.status(200).json({
        success: true,
        message: 'Assignments retrieved successfully',
        data: assignments
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new AssignmentController();

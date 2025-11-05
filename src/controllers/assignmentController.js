const assignmentService = require('../services/AssignmentService');

class AssignmentController {

  async createAssignment(req, res, next) {
    try {
      const { event_id, employee_id } = req.params;
      
      const assignment = await assignmentService.createAssignment(
        event_id,
        employee_id,
        req.body,
        req.user._id
      );

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
      
      const result = await assignmentService.deleteAssignment(
        event_id,
        employee_id,
        req.user._id
      );

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new AssignmentController();
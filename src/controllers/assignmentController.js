const assignmentService = require('../services/AssignmentService');

class AssignmentController {

  async createAssignment(req, res) {
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
      const status = error.statusCode || error.status || 500;
      res.status(status).json({
        success: false,
        message: error.message || 'Failed to create assignment',
        details: error.details || error.errors || undefined,
        timestamp: error.timestamp || undefined
      });
    }
  }

  async updateAssignment(req, res) {
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
      const status = error.statusCode || error.status || 500;
      res.status(status).json({
        success: false,
        message: error.message || 'Failed to update assignment',
        details: error.details || error.errors || undefined,
        timestamp: error.timestamp || undefined
      });
    }
  }

  async deleteAssignment(req, res) {
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
      const status = error.statusCode || error.status || 500;
      res.status(status).json({
        success: false,
        message: error.message || 'Failed to delete assignment',
        details: error.details || undefined,
        timestamp: error.timestamp || undefined
      });
    }
  }
}

module.exports = new AssignmentController();
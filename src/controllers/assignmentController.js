const AssignmentService = require('../services/assignmentService');

class AssignmentController {    
    createAssignment = async (request, response) => {
        return response
        .status(201)
        .json({ 
            statusCode: 201,
            message: 'Assignment successfully login'
        });
    };

    updateAssignment = async (request, response) => {
        return response
        .status(204)
    };

    deleteAssignment = async (request, response) => {
        return response
        .status(204)
    };
}

module.exports = new AssignmentController();
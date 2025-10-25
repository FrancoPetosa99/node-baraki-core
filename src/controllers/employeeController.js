const employeeService = require('../services/employeeService');

class EmployeeController {    
    createEmployee = async (request, response) => {
        return response
        .status(201)
        .json({ 
            statusCode: 201,
            message: 'Employee successfully login',
            data: { user_id }, 
        });
    };

    getEmployee = async (request, response) => {
        return response
        .status(200)
        .json({ 
            status: 'Success',
            message: 'Employee successfully retrieved',
            data: events
        });
    };

    getEmployees = async (request, response) => {
        return response
        .status(200)
        .json({ 
            status: 'Success',
            message: 'Employeess successfully retrieved',
            data: events
        });
    };

    getEmployeeEvents = async (request, response) => {
        return response
        .status(200)
        .json({ 
            status: 'Success',
            message: 'Events successfully retrieved',
            data: events
        });
    };

    updateEmployee = async (request, response) => {
        return response
        .status(204)
    }

    deleteEmployee = async (request, response) => {
        return response
        .status(204)
    }
}

module.exports = new EmployeeController();
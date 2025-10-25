const express = require('express');
const asyncMiddleware = require('../middlewares/asyncMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const authController = require('../controllers/AuthController'); 
const eventController = require('../controllers/eventsController');
const employeeController = require('../controllers/employeeController');
const assignmentController = require('../controllers/assignmentController');

const router = express.Router();

const baseAuthRoute = '/auth';
router.post(baseAuthRoute + '/login', asyncMiddleware(authController.login));
router.post(baseAuthRoute + '/register', asyncMiddleware(authController.register));

const baseEventRoute = '/events';
router.post(baseEventRoute, authMiddleware, asyncMiddleware(eventController.createEvent));
router.post(baseEventRoute + '/:id/guest', authMiddleware, asyncMiddleware(eventController.addGuest));
router.get(baseEventRoute, authMiddleware, asyncMiddleware(eventController.searchEvents));
router.get(baseEventRoute + '/:id', authMiddleware, asyncMiddleware(eventController.getEvent));
router.get(baseEventRoute + '/employees', authMiddleware, asyncMiddleware(eventController.getEventEmployees));
router.get(baseEventRoute + '/:id/guests', authMiddleware, asyncMiddleware(eventController.getEventGuests));
router.get(baseEventRoute + '/:id/invitations', authMiddleware, asyncMiddleware(eventController.getEventInvitation));
router.put(baseEventRoute + '/:id', authMiddleware, asyncMiddleware(eventController.updateEvent));
router.delete(baseEventRoute + '/:id', authMiddleware, asyncMiddleware(eventController.deleteEvent));
router.delete(baseEventRoute + 'event/:event_id/guest/:guest_id', authMiddleware, asyncMiddleware(eventController.removeGuest));

const baseEmployeesRoute = '/employees';
router.post(baseEmployeesRoute, authMiddleware, asyncMiddleware(employeeController.createEmployee));
router.get(baseEmployeesRoute, authMiddleware, asyncMiddleware(employeeController.getEmployees));
router.get(baseEmployeesRoute + '/:id', authMiddleware, asyncMiddleware(employeeController.getEmployee));
router.get(baseEmployeesRoute + '/:id/events', authMiddleware, asyncMiddleware(employeeController.getEmployeeEvents));
router.put(baseEmployeesRoute + '/:id', authMiddleware, asyncMiddleware(employeeController.updateEmployee));
router.delete(baseEmployeesRoute + '/:id', authMiddleware, asyncMiddleware(employeeController.deleteEmployee));

const baseAssignmentsRoute = '/assignments';
router.post(baseAssignmentsRoute + '/events/:event_id/employees/:employee_id', authMiddleware, asyncMiddleware(assignmentController.createAssignment));
router.put(baseAssignmentsRoute + '/event/:event_id/employee/:employee_id', authMiddleware, asyncMiddleware(assignmentController.updateAssignment));
router.delete(baseAssignmentsRoute + '/event/:event_id/employee/:employee_id', authMiddleware, asyncMiddleware(assignmentController.deleteAssignment));

module.exports = router;
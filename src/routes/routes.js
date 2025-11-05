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
// Events: Specific Use cases.
router.post(baseEventRoute + '/:id/guest', authMiddleware, asyncMiddleware(eventController.addGuest));
router.get(baseEventRoute + '/:id/guests', authMiddleware, asyncMiddleware(eventController.getEventGuests));
router.delete(baseEventRoute + '/:event_id/guest/:guest_id', authMiddleware, asyncMiddleware(eventController.removeGuest));
router.get(baseEventRoute + '/:id/invitations', authMiddleware, asyncMiddleware(eventController.getEventInvitation));
router.get(baseEventRoute + '/:id/employees', authMiddleware, asyncMiddleware(eventController.getEventEmployees));
router.get(baseEventRoute, authMiddleware, asyncMiddleware(eventController.searchEvents));
// Events: ABML
router.post(baseEventRoute, authMiddleware, asyncMiddleware(eventController.createEvent));
router.get(baseEventRoute + '/:id', authMiddleware, asyncMiddleware(eventController.getEvent));
router.put(baseEventRoute + '/:id', authMiddleware, asyncMiddleware(eventController.updateEvent));
router.delete(baseEventRoute + '/:id', authMiddleware, asyncMiddleware(eventController.deleteEvent));

const baseEmployeesRoute = '/employees';
router.post(baseEmployeesRoute, authMiddleware, asyncMiddleware(employeeController.createEmployee));
router.get(baseEmployeesRoute, authMiddleware, asyncMiddleware(employeeController.getEmployees));
router.get(baseEmployeesRoute + '/:id', authMiddleware, asyncMiddleware(employeeController.getEmployee));
router.get(baseEmployeesRoute + '/:id/events', authMiddleware, asyncMiddleware(employeeController.getEmployeeEvents));
router.put(baseEmployeesRoute + '/:id', authMiddleware, asyncMiddleware(employeeController.updateEmployee));
router.delete(baseEmployeesRoute + '/:id', authMiddleware, asyncMiddleware(employeeController.deleteEmployee));

const baseAssignmentsRoute = '/assignments';
router.post(baseAssignmentsRoute + '/event/:event_id/employee/:employee_id', authMiddleware, asyncMiddleware(assignmentController.createAssignment));
router.put(baseAssignmentsRoute + '/event/:event_id/employee/:employee_id', authMiddleware, asyncMiddleware(assignmentController.updateAssignment));
router.delete(baseAssignmentsRoute + '/event/:event_id/employee/:employee_id', authMiddleware, asyncMiddleware(assignmentController.deleteAssignment));

module.exports = router;
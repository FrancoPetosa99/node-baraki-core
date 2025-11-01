// controllers/eventController.js
const eventService = require('../services/eventService');

class EventController {

  async createEvent(req, res) {
    try {
      const event = await eventService.createEvent(req.body, req.user._id);

      res.status(201).json({
        success: true,
        message: 'Event created successfully',
        data: event
      });
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({
        success: false,
        message: error.message || 'Failed to create event',
        errors: error.errors || undefined
      });
    }
  }

  async searchEvents(req, res) {
    try {
      const result = await eventService.searchEvents(req.query, req.user._id);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({
        success: false,
        message: error.message || 'Failed to search events'
      });
    }
  }

  async getEvent(req, res) {
    try {
      const event = await eventService.getEvent(req.params.id, req.user._id);

      res.status(200).json({
        success: true,
        data: event
      });
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({
        success: false,
        message: error.message || 'Failed to get event'
      });
    }
  }

  async updateEvent(req, res) {
    try {
      const event = await eventService.updateEvent(
        req.params.id,
        req.body,
        req.user._id
      );

      res.status(200).json({
        success: true,
        message: 'Event updated successfully',
        data: event
      });
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({
        success: false,
        message: error.message || 'Failed to update event',
        errors: error.errors || undefined
      });
    }
  }

  async deleteEvent(req, res) {
    try {
      const result = await eventService.deleteEvent(req.params.id, req.user._id);

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({
        success: false,
        message: error.message || 'Failed to delete event'
      });
    }
  }

  async addGuest(req, res) {
    try {
      const event = await eventService.addGuest(
        req.params.id,
        req.body,
        req.user._id
      );

      res.status(201).json({
        success: true,
        message: 'Guest added successfully',
        data: event
      });
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({
        success: false,
        message: error.message || 'Failed to add guest',
        errors: error.errors || undefined
      });
    }
  }

  async getEventGuests(req, res) {
    try {
      const guests = await eventService.getEventGuests(req.params.id, req.user._id);

      res.status(200).json({
        success: true,
        data: guests
      });
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({
        success: false,
        message: error.message || 'Failed to get guests'
      });
    }
  }

  async removeGuest(req, res) {
    try {
      const result = await eventService.removeGuest(
        req.params.event_id,
        req.params.guest_id,
        req.user._id
      );

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({
        success: false,
        message: error.message || 'Failed to remove guest'
      });
    }
  }

  async getEventEmployees(req, res) {
    try {
      const employees = await eventService.getEventEmployees(
        req.params.id,
        req.user._id
      );

      res.status(200).json({
        success: true,
        data: employees
      });
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({
        success: false,
        message: error.message || 'Failed to get event employees'
      });
    }
  }

  async getEventInvitation(req, res) {
    try {
      const invitation = await eventService.getEventInvitation(
        req.params.id,
        req.user._id
      );

      res.status(200).json({
        success: true,
        data: invitation
      });
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({
        success: false,
        message: error.message || 'Failed to get invitation'
      });
    }
  }
}

module.exports = new EventController();
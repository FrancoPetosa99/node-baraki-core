const eventService = require('../services/eventService');

class EventController {
  async createEvent(req, res, next) {
    try {
      const event = await eventService.createEvent(req.body, req.user._id);

      res.status(201).json({
        success: true,
        message: 'Event created successfully',
        data: event
      });
    } catch (error) {
      return next(error);
    }
  }

  async searchEvents(req, res, next) {
    try {
      const result = await eventService.searchEvents(req.query, req.user._id);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      return next(error);
    }
  }

  async getEvent(req, res, next) {
    try {
      const event = await eventService.getEvent(req.params.id, req.user._id);

      res.status(200).json({
        success: true,
        data: event
      });
    } catch (error) {
      return next(error);
    }
  }

  async updateEvent(req, res, next) {
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
      return next(error);
    }
  }

  async deleteEvent(req, res, next) {
    try {
      const result = await eventService.deleteEvent(req.params.id, req.user._id);

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      return next(error);
    }
  }

  async addGuest(req, res, next) {
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
      return next(error);
    }
  }

  async getEventGuests(req, res, next) {
    try {
      const guests = await eventService.getEventGuests(req.params.id, req.user._id);

      res.status(200).json({
        success: true,
        data: guests
      });
    } catch (error) {
      return next(error);
    }
  }

  async removeGuest(req, res, next) {
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
      return next(error);
    }
  }

  async getEventEmployees(req, res, next) {
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
      return next(error);
    }
  }

  async getEventInvitation(req, res, next) {
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
      return next(error);
    }
  }
}

module.exports = new EventController();
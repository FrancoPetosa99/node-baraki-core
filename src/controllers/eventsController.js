class EventsController {    
    createEvent = async (request, response) => {
        return response
        .status(201)
        .json({ 
            statusCode: 200,
            message: 'Event successfully login',
            data: { user_id }, 
        });
    };

    addGuest = async (request, response) => {
        return response
        .status(201)
        .json({ 
            statusCode: 200,
            message: 'Guest successfully added',
            data: { guest }, 
        });
    };

    searchEvents = async (request, response) => {
        return response
        .status(200)
        .json({ 
            status: 'Success',
            message: 'Events successfully retrieved',
            data: events
        });
    };

    getEvent = async (request, response) => {
        return response
        .status(201)
        .json({ 
            status: 'Success',
            message: 'Event successfully retrieved',
            data: event
        });
    };

    getEventGuests = async (request, response) => {
        return response
        .status(200)
        .json({ 
            status: 'Success',
            message: 'Guests successfully retrieved',
            data: guests
        });
    };

    getEventEmployees = async (request, response) => {
        return response
        .status(200)
        .json({ 
            status: 'Success',
            message: 'Employees successfully retrieved',
            data: employees
        });
    };

    getEventInvitation = async (request, response) => {
        return response
        .status(200)
        .json({ 
            status: 'Success',
            message: 'Invitation successfully retrieved',
            data: invitation
        });
    };

    updateEvent = async (request, response) => {
        return response
        .status(204)
    };

    deleteEvent = async (request, response) => {
        return response
        .status(204)
    };

    removeGuest = async (request, response) => {
        return response
        .status(204)
    };
}

module.exports = new EventsController();
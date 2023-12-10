import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Event from 'App/Models/Event'
import EventInvitation from 'App/Models/EventInvitation'
import CreateEventValidator from 'App/Validators/CreateEventValidator'

export default class EventsController {
  public async index({ response, auth }: HttpContextContract) {
    try {
      const user = await auth.use('api').authenticate()
      const ownEvents = await Event.query().where('userId', user.id)
      const invitedEvents = await EventInvitation.query()
        .where('inviteeId', user.id)
        .andWhere('accepted', true)
        .preload('event')

      return response
        .status(200)
        .json({ ownEvents, invitedEvents: invitedEvents.map((invitation) => invitation.event) })
    } catch (error) {
      return response.status(error.status).json({ message: error.message })
    }
  }

  public async show({ params, response, auth }: HttpContextContract) {
    try {
      const user = await auth.use('api').authenticate()
      const event = await Event.query().where('id', params.id).first()

      if (
        !event ||
        (event.userId !== user.id &&
          !(await EventInvitation.query()
            .where('eventId', event.id)
            .where('inviteeId', user.id)
            .andWhere('accepted', true)
            .first()))
      ) {
        return response.status(404).json({ message: 'Event not found' })
      }
      return response.status(200).json(event)
    } catch (error) {
      return response.status(error.status).json({ message: error.message })
    }
  }

  public async store({ request, response, auth }: HttpContextContract) {
    try {
      const payload = await request.validate(CreateEventValidator)
      const user = auth.use('api').user
      if (!user) {
        return response.status(401).json({ message: 'User not authenticated' })
      }
      console.log(user.id)

      const event = await Event.create({ ...payload, userId: user.id })
      return response.status(201).json(event)
    } catch (error) {
      const statusCode = error.status && typeof error.status === 'number' ? error.status : 500
      return response.status(statusCode).json({ message: error.message })
    }
  }

  public async update({ params, request, response, auth }: HttpContextContract) {
    try {
      const user = await auth.use('api').authenticate()
      const event = await Event.query().where('id', params.id).first()

      if (!event || event.userId !== user.id) {
        return response.status(403).json({ message: 'You are not authorized to update this event' })
      }

      event.merge(request.only(['name', 'date', 'location']))
      await event.save()

      return response.status(200).json(event)
    } catch (error) {
      return response.status(error.status).json({ message: error.message })
    }
  }

  public async destroy({ params, response, auth }: HttpContextContract) {
    try {
      const user = await auth.use('api').authenticate()
      const event = await Event.query().where('id', params.id).first()

      if (!event || event.userId !== user.id) {
        return response.status(403).json({ message: 'You are not authorized to delete this event' })
      }

      await event.delete()

      return response.status(200).json({ message: 'Event deleted' })
    } catch (error) {
      return response.status(error.status).json({ message: error.message })
    }
  }

  public async search({ request, response, auth }: HttpContextContract) {
    try {
      const { title } = request.all()
      const user = auth.use('api').user
      if (!user) {
        return response.status(401).json({ message: 'User not authenticated' })
      }
      const events = await Event.query()
        .where('title', 'like', `%${title}%`)
        .where('userId', user.id)
      return response.status(200).json(events)
    } catch (error) {
      return response.status(error.status).json({ message: error.message })
    }
  }

  public async getEventsByUser({ params, response }: HttpContextContract) {
    try {
      const events = await Event.query().where('user_id', params.id)
      return response.status(200).json(events)
    } catch (error) {
      return response.status(error.status).json({ message: error.message })
    }
  }
}

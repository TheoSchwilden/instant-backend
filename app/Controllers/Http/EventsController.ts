import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Event from 'App/Models/Event'
import CreateEventValidator from 'App/Validators/CreateEventValidator'
import { logger } from 'Config/app'

export default class EventsController {
  public async index({ response }: HttpContextContract) {
    try {
      const events = await Event.all()
      return response.status(200).json(events)
    } catch (error) {
      return response.status(error.status).json({ message: error.message })
    }
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const event = await Event.findOrFail(params.id)
      return response.status(200).json(event)
    } catch (error) {
      return response.status(error.status).json({ message: error.message })
    }
  }

  public async store({ request, response, auth }: HttpContextContract) {
    try {
      logger.info('Request body:', request.body()) // Log the request body
      const payload = await request.validate(CreateEventValidator)
      logger.info('Payload after validation:', payload) // Log the payload after validation
      const user = auth.use('api').user
      if (!user) {
        return response.status(401).json({ message: 'User not authenticated' })
      }
      const event = await Event.create({ ...payload, userId: user.id })
      return response.status(201).json(event)
    } catch (error) {
      logger.info('Error:', error) // Log the error
      return response.status(error.status).json({ message: error.message })
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    try {
      const payload = await request.validate(CreateEventValidator)
      const event = await Event.findOrFail(params.id)
      event.merge(payload)
      await event.save()
      return response.status(200).json(event)
    } catch (error) {
      return response.status(error.status).json({ message: error.message })
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const event = await Event.findOrFail(params.id)
      await event.delete()
      return response.status(204)
    } catch (error) {
      return response.status(error.status).json({ message: error.message })
    }
  }

  public async search({ request, response }: HttpContextContract) {
    try {
      const { title } = request.all()
      const events = await Event.query().where('title', 'like', `%${title}%`)
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

  public async getPastEvents({ response }: HttpContextContract) {
    try {
      const events = await Event.query().where('date', '<', new Date())
      return response.status(200).json(events)
    } catch (error) {
      return response.status(error.status).json({ message: error.message })
    }
  }

  public async getUpcomingEvents({ response }: HttpContextContract) {
    try {
      const events = await Event.query().where('date', '>', new Date())
      return response.status(200).json(events)
    } catch (error) {
      return response.status(error.status).json({ message: error.message })
    }
  }
}

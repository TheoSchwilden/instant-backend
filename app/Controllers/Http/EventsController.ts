import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Event from 'App/Models/Event'
import CreateEventValidator from 'App/Validators/CreateEventValidator'

export default class EventsController {
  public async index({ response, auth }: HttpContextContract) {
    try {
      const user = auth.use('api').user
      if (!user) {
        return response.status(401).json({ message: 'User not authenticated' })
      }
      const events = await Event.query().where('user_id', user.id)
      return response.status(200).json(events)
    } catch (error) {
      return response.status(error.status).json({ message: error.message })
    }
  }

  public async show({ params, response, auth }: HttpContextContract) {
    try {
      const user = auth.use('api').user
      if (!user) {
        return response.status(401).json({ message: 'User not authenticated' })
      }
      const event = await Event.query().where('id', params.id).where('userId', user.id).first()
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
      const payload = await request.validate(CreateEventValidator)
      const user = auth.use('api').user
      if (!user) {
        return response.status(401).json({ message: 'User not authenticated' })
      }
      const event = await Event.query().where('id', params.id).where('userId', user.id).first()
      if (!event) {
        return response.status(404).json({ message: 'Event not found' })
      }
      event.merge(payload)
      await event.save()
      return response.status(200).json(event)
    } catch (error) {
      return response.status(error.status).json({ message: error.message })
    }
  }

  public async destroy({ params, response, auth }: HttpContextContract) {
    try {
      const user = auth.use('api').user
      if (!user) {
        return response.status(401).json({ message: 'User not authenticated' })
      }
      const event = await Event.query().where('id', params.id).where('userId', user.id).first()
      if (!event) {
        return response.status(404).json({ message: 'Event not found' })
      }
      await event.delete()
      return response.status(204)
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

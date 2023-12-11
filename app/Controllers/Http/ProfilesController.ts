import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateProfileValidator from 'App/Validators/CreateProfileValidator'

export default class ProfilesController {
  public async getProfile({ response, auth }: HttpContextContract) {
    try {
      const user = await auth.use('api').authenticate()
      const profile = await user.related('profile').query().first()
      return response.status(200).json(profile)
    } catch (error) {
      return response.status(error.status).json({ message: error.message })
    }
  }

  public async store({ request, response, auth }: HttpContextContract) {
    try {
      const payload = await request.validate(CreateProfileValidator)
      const user = await auth.use('api').authenticate()
      const existingProfile = await user.related('profile').query().first()
      if (existingProfile) {
        return response.status(409).json({ message: 'Profile already exists' })
      }
      const profile = await user.related('profile').create(payload)
      return response.status(201).json(profile)
    } catch (error) {
      const statusCode = error.status && typeof error.status === 'number' ? error.status : 500
      return response.status(statusCode).json({ message: error.message })
    }
  }

  public async update({ request, response, auth }: HttpContextContract) {
    try {
      const payload = await request.validate(CreateProfileValidator)
      const user = await auth.use('api').authenticate()
      const profile = await user.related('profile').query().first()
      if (!profile) {
        return response.status(404).json({ message: 'Profile not found' })
      }
      profile.merge(payload)
      await profile.save()
      return response.status(200).json(profile)
    } catch (error) {
      const statusCode = error.status && typeof error.status === 'number' ? error.status : 500
      return response.status(statusCode).json({ message: error.message })
    }
  }
}

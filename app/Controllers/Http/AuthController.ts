import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import CreateUserValidator from 'App/Validators/CreateUserValidator'

export default class AuthController {
  public async login({ auth, request, response }: HttpContextContract) {
    try {
      const { email, password } = request.all()
      await auth.attempt(email, password)
      return response.status(200).json({ message: 'Logged in successfully' })
    } catch (error) {
      return response.status(error.status).json({ message: error.message })
    }
  }

  public async register({ request, response }: HttpContextContract) {
    try {
      const payload = await request.validate(CreateUserValidator)
      await User.create(payload)

      return response.status(200).json({ message: 'User registered successfully' })
    } catch (error) {
      // Adonis peut gérer les erreurs ici, par exemple, si la validation échoue
      return response.status(error.status).json({ message: error.message })
    }
  }
}

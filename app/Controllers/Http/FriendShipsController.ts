import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import FriendShip from 'App/Models/FriendShip'

export default class FriendShipsController {
  public async index({ response, auth }: HttpContextContract) {
    try {
      const user = auth.use('api').user
      if (!user) {
        return response.status(401).json({ message: 'User not authenticated' })
      }
      const friends = await user
        .related('friends')
        .query()
        .preload('friend', (query) => {
          query.preload('profile')
        })
      return response.status(200).json(friends)
    } catch (error) {
      return response.status(error.status).json({ message: error.message })
    }
  }

  public async addFriend({ request, response, auth }: HttpContextContract) {
    try {
      const user = await auth.use('api').authenticate()
      const { friendId } = request.only(['friendId'])
      const friendShip = new FriendShip()
      friendShip.userId = user.id
      friendShip.friendId = friendId
      await friendShip.save()
      return response.status(201).json(friendShip)
    } catch (error) {
      return response.status(error.status).json({ message: error.message })
    }
  }

  public async acceptFriend({ auth, params, response }: HttpContextContract) {
    try {
      const user = await auth.use('api').authenticate()
      const friendShip = await FriendShip.query()
        .where('friend_id', user.id)
        .where('user_id', params.id)
        .firstOrFail()
      friendShip.accepted = true
      await friendShip.save()
      return response.status(200).json(friendShip)
    } catch (error) {
      return response.status(error.status).json({ message: error.message })
    }
  }

  public async rejectFriend({ auth, params, response }: HttpContextContract) {
    try {
      const user = await auth.use('api').authenticate()
      const friendShip = await FriendShip.query()
        .where('friend_id', user.id)
        .where('user_id', params.id)
        .firstOrFail()
      await friendShip.delete()
      return response.status(200).json({ message: 'Friendship rejected' })
    } catch (error) {
      return response.status(error.status).json({ message: error.message })
    }
  }

  public async deleteFriend({ auth, params, response }: HttpContextContract) {
    try {
      const user = await auth.use('api').authenticate()
      const friendShip = await FriendShip.query()
        .where('friend_id', user.id)
        .where('user_id', params.id)
        .firstOrFail()
      await friendShip.delete()
      return response.status(200).json({ message: 'Friendship deleted' })
    } catch (error) {
      return response.status(error.status).json({ message: error.message })
    }
  }
}

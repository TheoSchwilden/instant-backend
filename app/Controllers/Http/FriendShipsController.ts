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
        .where('accepted', true)
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
      console.log(friendShip)

      await friendShip.save()
      return response.status(201).json(friendShip)
    } catch (error) {
      return response.status(error.status || 500).json({ message: error.message })
    }
  }

  public async acceptFriend({ auth, params, response }: HttpContextContract) {
    try {
      const user = await auth.use('api').authenticate()
      console.log(user.id) // Ajoutez cette ligne
      console.log(params.id) // Ajoutez cette ligne
      const friendShip = await FriendShip.query()
        .where('user_id', params.id)
        .where('friend_id', user.id)
        .firstOrFail()
      console.log(friendShip)
      friendShip.accepted = true
      await friendShip.save()

      const reverseFriendShip = new FriendShip()
      reverseFriendShip.userId = user.id
      reverseFriendShip.friendId = params.id
      reverseFriendShip.accepted = true
      await reverseFriendShip.save()

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

      const reverseFriendShip = await FriendShip.query()
        .where('user_id', user.id)
        .where('friend_id', params.id)
        .firstOrFail()
      await reverseFriendShip.delete()

      return response.status(200).json({ message: 'Friendship deleted' })
    } catch (error) {
      return response.status(error.status).json({ message: error.message })
    }
  }
}

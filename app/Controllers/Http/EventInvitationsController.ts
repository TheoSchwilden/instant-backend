import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import EventInvitation from 'App/Models/EventInvitation'

export default class EventInvitationsController {
  public async inviteToEvent({ request, response, auth }: HttpContextContract) {
    try {
      const user = await auth.use('api').authenticate()
      const { eventId, inviteeId } = request.only(['eventId', 'inviteeId'])

      const invitation = new EventInvitation()
      invitation.eventId = eventId
      invitation.userId = user.id
      invitation.inviteeId = inviteeId
      await invitation.save()

      return response.status(201).json(invitation)
    } catch (error) {
      return response.status(error.status).json({ message: error.message })
    }
  }

  public async acceptInvitationToEvent({ params, response, auth }: HttpContextContract) {
    try {
      const user = await auth.use('api').authenticate()
      const invitation = await EventInvitation.query()
        .where('id', params.id)
        .where('inviteeId', user.id)
        .first()
      if (!invitation) {
        return response.status(404).json({ message: 'Invitation not found' })
      }
      invitation.accepted = true
      await invitation.save()
      return response.status(200).json(invitation)
    } catch (error) {
      return response.status(error.status).json({ message: error.message })
    }
  }

  public async rejectInvitationToEvent({ params, response, auth }: HttpContextContract) {
    try {
      const user = await auth.use('api').authenticate()
      const invitation = await EventInvitation.query()
        .where('id', params.id)
        .where('inviteeId', user.id)
        .first()
      if (!invitation) {
        return response.status(404).json({ message: 'Invitation not found' })
      }
      await invitation.delete()
      return response.status(200).json({ message: 'Invitation rejected' })
    } catch (error) {
      return response.status(error.status).json({ message: error.message })
    }
  }
}

import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Event from './Event'

export default class EventInvitation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public eventId: number

  @column()
  public userId: number

  @column()
  public inviteeId: number

  @column()
  public accepted: boolean

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  public user: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'inviteeId',
  })
  public invitee: BelongsTo<typeof User>

  @belongsTo(() => Event, {
    foreignKey: 'eventId',
  })
  public event: BelongsTo<typeof Event>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}

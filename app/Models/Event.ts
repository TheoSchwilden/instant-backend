import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'

export default class Event extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public image: string

  @column.dateTime({
    autoCreate: true,
    serialize: (value: DateTime) => value.toFormat('dd-MM-yyyy'),
  })
  public date: DateTime

  @column.dateTime({ autoCreate: true, serialize: (value: DateTime) => value.toFormat('HH:mm') })
  public time: DateTime

  @column()
  public location: string

  @column({ serializeAs: null })
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async formatDates(model: Event) {
    if (model.date) {
      model.date = DateTime.fromFormat(model.date.toFormat('dd-MM-yyyy'), 'dd-MM-yyyy')
    }

    if (model.time) {
      model.time = DateTime.fromFormat(model.time.toFormat('HH:mm'), 'HH:mm')
    }
  }
}

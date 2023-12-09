import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateEventValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string([ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string([
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    title: schema.string({ trim: true }, [rules.minLength(3)]),
    description: schema.string({ trim: true }, [rules.minLength(3)]),
    image: schema.string({ trim: true }, [rules.url()]),
    date: schema.date({ format: 'dd-MM-yyyy' }),
    time: schema.date({ format: 'HH:mm' }),
    location: schema.string({ trim: true }, [rules.minLength(3)]),
    userId: schema.number(),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    'title.minLength': 'Le titre doit comporter au moins 3 caractères',
    'description.minLength': 'La description doit comporter au moins 3 caractères',
    'image.url': "L'image doit être une URL valide",
    'date.date': 'La date doit être une date valide',
    'time.date': "L'heure doit être une date valide",
    'location.minLength': "L'emplacement doit comporter au moins 3 caractères",
    'userId.number': "L'ID de l'utilisateur doit être un nombre",
  }
}

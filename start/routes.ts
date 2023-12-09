/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async ({ view }) => {
  return view.render('welcome')
})

Route.group(() => {
  Route.post('/login', 'AuthController.login')
  Route.post('/register', 'AuthController.register')
  Route.post('/logout', 'AuthController.logout').middleware('auth')
}).prefix('api')

Route.group(() => {
  Route.get('/events', 'EventsController.index')
  Route.get('/events/:id', 'EventsController.show')
  Route.post('/events', 'EventsController.store')
  Route.put('/events/:id', 'EventsController.update')
  Route.delete('/events/:id', 'EventsController.destroy')
  Route.post('/events/search', 'EventsController.search')
  Route.get('/events/user/:id', 'EventsController.getEventsByUser')
})
  .middleware('auth')
  .prefix('api')

Route.group(() => {
  Route.get('/profiles', 'ProfilesController.getProfile')
  Route.post('/profiles', 'ProfilesController.store')
  Route.put('/profiles/:id', 'ProfilesController.update')
})
  .middleware('auth')
  .prefix('api')

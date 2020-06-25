import { Router } from 'express'

import UserController from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'

import authMiddleware from './app/middlewares/auth'

const routes = new Router()

routes.post('/sessions', SessionController.store)

routes.get('/users', UserController.index)
routes.post('/users', UserController.store)
routes.get('/users/:id', UserController.show)
routes.put('/users/:id', UserController.update)
routes.delete('/users/:id', UserController.destroy)

routes.use(authMiddleware)

// Our routes come here

export default routes

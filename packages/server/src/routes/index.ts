import { Router } from 'express'
import { createUserController } from '../controllers/createUser'
import { loginController } from '../controllers/login'

export const router = Router()

router.post('/create', createUserController.handle)

router.post('/login', loginController.handle)

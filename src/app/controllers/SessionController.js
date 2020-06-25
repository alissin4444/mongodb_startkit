import jwt from 'jsonwebtoken'
import authConfig from '../../config/auth'
import User from '../schemas/User'

class SessionController {
  async store(req, res) {
    const { email, password } = req.body

    try {
      const user = await User.findOne({ email })

      if (!user || !(await user.checkPassword(password))) {
        return res.status(401).json({ error: 'Credentials not match' })
      }

      const { id, name } = user

      return res.json({
        user: {
          id,
          name,
          email
        },
        token: jwt.sign({ id }, authConfig.secret, {
          expiresIn: authConfig.expiresIn
        })
      })
    } catch (err) {
      return res
        .status(500)
        .json({ path: 'server', error: 'Internal server error' })
    }
  }
}

export default new SessionController()

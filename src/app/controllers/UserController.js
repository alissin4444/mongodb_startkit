import User from '../schemas/User'

class UserController {
  async index(_req, res) {
    const users = await User.find()
    return res.json(users)
  }

  async store(req, res) {
    const { name, email, password } = req.body

    const emailIsNotAvailable = await User.findOne({ email })
    if (emailIsNotAvailable) {
      return res
        .status(400)
        .json({ path: 'email', error: 'Email not available' })
    }

    const user = await User.create({ name, email, password })
    return res.json(user)
  }

  async show(req, res) {
    const { id } = req.params

    try {
      const user = await User.findById(id)
      if (!user) {
        return res.status(404).json({ path: '_id', error: 'User not found' })
      }
      return res.json(user)
    } catch (err) {
      return res
        .status(500)
        .json({ path: 'server', error: 'Internal server error' })
    }
  }

  async update(req, res) {
    const { id } = req.params

    try {
      const user = await User.findById(id)
      if (!user) {
        return res.status(404).json({ path: '_id', error: 'User not found' })
      }

      const { name, email, password, oldPassword } = req.body

      if (email && user.email !== email) {
        const emailIsNotAvailable = await User.findOne({ email })
        if (emailIsNotAvailable) {
          return res
            .status(400)
            .json({ path: 'email', error: 'Email not available' })
        }
        user.email = email
      }

      if (oldPassword) {
        if (await user.checkPassword(oldPassword)) {
          user.password = password
        } else {
          return res.status(400).json({
            path: 'oldPassword',
            error: 'OldPassword does not match'
          })
        }
      }

      user.name = name

      await user.save()

      return res.json(user)
    } catch (err) {
      return res
        .status(500)
        .json({ path: 'server', error: 'Internal server error' })
    }
  }

  async destroy(req, res) {
    const { id } = req.params

    try {
      const user = await User.findById(id)
      if (!user) {
        return res.status(404).json({ path: '_id', error: 'User not found' })
      }
      await user.deleteOne()
      return res.json()
    } catch (err) {
      return res
        .status(500)
        .json({ path: 'server', error: 'Internal server error' })
    }
  }
}

export default new UserController()

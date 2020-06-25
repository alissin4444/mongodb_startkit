import mongoose from 'mongoose'

import bcrypt from 'bcryptjs'

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

UserSchema.pre('save', function (next) {
  var user = this
  if (!user.isModified('password')) return next()
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err)
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err)
      user.password = hash
      next()
    })
  })
})

UserSchema.methods.checkPassword = async function validatePassword(data) {
  return bcrypt.compare(data, this.password)
}

export default mongoose.model('User', UserSchema)

import mongoose from 'mongoose'

export const connectDd = () => {
  mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log('Mongodb Connected ✅'))
  .catch((e) => console.log('Mongodb Connection Failed ❌', e))
}
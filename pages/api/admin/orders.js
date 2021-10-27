import nc from 'next-connect'
import db from '../../../utils/db'
import Order from '../../../models/Order'
import { onError } from '../../../utils/error'
import { isAuth, isAdmin } from '../../../utils/auth'

const handler = nc({
  onError
})
handler.use(isAuth, isAdmin)

handler.get(async (req, res) => {
  await db.connect();
  const orders = await Order.find({}).populate('user', 'name')
  res.send(orders)
})

export default handler
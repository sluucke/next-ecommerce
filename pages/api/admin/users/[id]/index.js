import nc from 'next-connect'
import db from '../../../../../utils/db'
import User from '../../../../../models/User'
import { onError } from '../../../../../utils/error'
import { isAuth, isAdmin } from '../../../../../utils/auth'

const handler = nc({
  onError
})
handler.use(isAuth, isAdmin)

handler.get(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.query.id)
  res.send(user)
})

handler.put(async (req, res) => {
  await db.connect()
  const user = await User.findById(req.query.id)
  if (user) {
    user.name = req.body.name
    user.email = req.body.email
    user.password = req.body.password
    user.isAdmin = req.body.isAdmin
    await user.save()
    await db.disconnect()
    res.send({ message: 'Usuário atualizado com sucesso' })
  } else {
    await db.disconnect()
    res.status(404).send({ message: 'Usuário não encontrado' })
  }
})

handler.delete(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.query.id);
  if (user) {
    await user.remove();
    await db.disconnect();
    res.send({ message: 'Usuário deletado' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Usuário não encontrado' });
  }
})



export default handler
import nc from 'next-connect';
import db from '../../../../utils/db';
import Order from '../../../../models/Order';
import { isAuth } from '../../../../utils/auth';
import { onError } from '../../../../utils/error';

const handler = nc({
  onError,
});

handler.use(isAuth);

handler.put(async (req, res) => {
  await db.connect();
  const order = await Order.findById(req.query.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const deliveredOrder = order.save();
    await db.disconnect();
    res.send({ message: 'Pedido entregue', order: deliveredOrder });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Pedido não encontrado' });
  }
});

export default handler;

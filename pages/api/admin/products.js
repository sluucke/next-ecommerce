import nc from 'next-connect';
import Product from '../../../models/Product';
import { isAuth, isAdmin } from '../../../utils/auth';
import db from '../../../utils/db';
import { onError } from '../../../utils/error';

const handler = nc({
  onError,
});
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const products = await Product.find({});
  await db.disconnect();
  res.send(products);
});

handler.post(async (req, res) => {
  await db.connect();
  const newProduct = new Product({
    name: 'nome simples',
    slug: 'simples-url-' + Math.floor(Math.random() * 100),
    image: '/images/macacaopantacour.jpg',
    price: 0,
    category: 'categoria simples',
    brand: 'marca simples',
    countInStock: 0,
    description: 'descrição simples',
    rating: 0,
    numReviews: 0,
    isFeatured: false,
  });
  const product = await newProduct.save().catch((err) => {
    console.log(err);
  });
  await db.disconnect();
  res.send({ message: 'Produto criado', product });
});

export default handler;

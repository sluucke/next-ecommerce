import { Grid, Card, List, ListItem, Typography, Button } from '@material-ui/core'
import NextLink from 'next/link'
import Image from 'next/image'
import Layout from '../../components/Layout'
import { Link } from '@material-ui/core'
import useStyles from '../../utils/styles'
import db from '../../utils/db'
import Product from '../../models/Product'
import axios from 'axios'
import { useContext } from 'react'
import Store from '../../utils/store'
import { useRouter } from 'next/router'


export default function ProductScreen({product}) {
  const router = useRouter()
  const { state, dispatch } = useContext(Store)
  const classes = useStyles()
  if (!product) {
    return (
      <>
      <h1>404 - Product Not Found</h1>
      <NextLink href="/" passHref>
        <Button variant="contained" color="primary">Página inicial</Button>
      </NextLink>
      </>
    )
  }
  const addToCardHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id)
    const quantity = existItem ? existItem.quantity + 1 : 1
    const { data } = await axios.get(`/api/products/${product._id}`)
    if(quantity > data.countInStock) {
      window.alert('Desculpe, esse produto está fora de estoque')
      return;
    }
    dispatch({ type: 'CARD_ADD_ITEM', payload: {...product, quantity, size: 'p'}})
    router.push('/cart')
  }
  return(
    <Layout title={product.name} description={product.description}>
      <div className={classes.section} >
        <NextLink href="/" passHref>
          <Typography>
            <Link className={classes.primaryLink} style={{ textDecoration: 'none' }}>início</Link> / {product.category} / {product.name}
          </Typography>
        </NextLink> 
      </div>
      <Grid container spacing={1} className={classes.card}>
        <Grid item md={6} xs={12}>
          <Image src={product.image} alt={product.name} width={640} height={640} layout="responsive" />
        </Grid>
        <Grid item md={6} xs={12}>
          <List>
            <ListItem>
              <Typography component="h1" variant="h1" style={{ color: '#F2758B' }}>{product.name}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Categoria: {product.category}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Marca: {product.brand}</Typography> 
            </ListItem>
            <ListItem>
              <Typography>Reputação: {product.rating} estrelas ({product.numReviews} avaliações)</Typography>
            </ListItem>
            <ListItem alignItems="start">
              Descrição:
              <Typography>{product.description}</Typography>
            </ListItem>
            <ListItem>
              <Typography variant="h4" style={{ color: '#F2758B'}}>R$ {product.price.toFixed(2).toString().replace('.', ',')}</Typography>
              <Typography>&nbsp;em até 6x <span style={{ color: '#F2758B' }}>R${(product.price / 6).toFixed(2).toString().replace('.', ',')} sem juros</span></Typography>
            </ListItem>
            <ListItem>
              <Typography>Tamanho:</Typography>
            </ListItem>
            <ListItem>
              {product.sizes.map((size) => (
                <Card key={size} className={classes.sizes}>
                    <Typography>{size}</Typography>
                </Card>
              ))}
            </ListItem>
            <ListItem>

            <Typography>Estoque: {product.countInStock > 0 ? `${product.countInStock} Unidades` : 'Estoque indisponível'}</Typography>
            </ListItem>
            <ListItem>
              <Button fullWidth variant="contained" className={classes.primaryBtn} disableElevation onClick={addToCardHandler}>Adicionar ao carrinho</Button>
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </Layout>
  )
}

export async function getServerSideProps(ctx) {
  const { params } = ctx
  const {slug} = params

  await db.connect()
  const product = await Product.findOne({slug}).lean()
  await db.disconnect()
  return {
    props: {
      product: db.convertDocToObj(product)
    }
  }

}
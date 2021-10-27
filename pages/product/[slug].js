import { Grid, Card, List, ListItem, Typography, Button, CircularProgress, TextField } from '@material-ui/core'
import NextLink from 'next/link'
import Image from 'next/image'
import Layout from '../../components/Layout'
import { Link } from '@material-ui/core'
import useStyles from '../../utils/styles'
import db from '../../utils/db'
import Product from '../../models/Product'
import axios from 'axios'
import { useContext, useState } from 'react'
import Store from '../../utils/store'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { Rating } from '@material-ui/lab'
import { getError } from '../../utils/error'
import { useEffect } from 'react'

export default function ProductScreen({ product }) {
  const router = useRouter()
  const { state, dispatch } = useContext(Store)
  const { userInfo } = state
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()

  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post(`/api/products/${product._id}/reviews`, { rating, comment }, {
        headers: { authorization: `Bearer ${userInfo.token}` }
      })
      setLoading(false)
      enqueueSnackbar('Avaliação enviada com sucesso', { variant: 'success' })
      fetchReviews()
    } catch (err) {
      setLoading(false)
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  }
  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`/api/products/${product._id}/reviews`)
      setReviews(data)
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  }
  useEffect(() => {
    fetchReviews()
  }, [])
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
    if (quantity > data.countInStock) {
      window.alert('Desculpe, esse produto está fora de estoque')
      return;
    }
    dispatch({ type: 'CARD_ADD_ITEM', payload: { ...product, quantity, size: 'p' } })
    router.push('/cart')
  }
  return (
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
              <Rating value={product.rating} readOnly></Rating>
              <Link href="#reviews">
                <Typography>({product.numReviews} avaliações)</Typography>
              </Link>
            </ListItem>
            <ListItem alignItems="start">
              Descrição:
              <Typography>{product.description}</Typography>
            </ListItem>
            <ListItem>
              <Typography variant="h4" style={{ color: '#F2758B' }}>R$ {product.price.toFixed(2).toString().replace('.', ',')}</Typography>
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
      <List>
        <ListItem>
          <Typography name="reviews" id="reviews" variant="h2">
            Avaliação dos clientes
          </Typography>
        </ListItem>
        <ListItem>
          <Typography>O que nossos clientes acharam desse produto?</Typography>
        </ListItem>
        {reviews.length === 0 && <ListItem>Sem avaliações</ListItem>}
        {reviews.map((review) => (
          <ListItem key={review._id}>
            <Grid container>
              <Grid item className={classes.reviewItem}>
                <Typography>
                  <strong>{review.name}</strong>
                </Typography>
                <Typography>{review.createdAt.substring(0, 10)}</Typography>
              </Grid>
              <Grid item>
                <Rating value={review.rating} readOnly></Rating>
                <Typography>{review.comment}</Typography>
              </Grid>
            </Grid>
          </ListItem>
        ))}
        <ListItem>
          {userInfo ? (
            <form onSubmit={submitHandler} className={classes.reviewForm}>
              <List>
                <ListItem>
                  <Typography variant="h2">Escreva sua avaliação</Typography>
                </ListItem>
                <ListItem>
                  <TextField
                    multiline
                    variant="outlined"
                    fullWidth
                    name="review"
                    label="Comentário"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </ListItem>
                <ListItem>
                  <Rating
                    name="simple-controlled"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  />
                </ListItem>
                <ListItem>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                  >
                    {loading ? <CircularProgress color="secondary" /> : 'Enviar'}
                  </Button>


                </ListItem>
              </List>
            </form>
          ) : (
            <Typography variant="h2">
              Por favor&nbsp;
              <Link href={`/login?redirect=/product/${product.slug}`}>
                entre
              </Link>&nbsp;
              para escrever uma avaliação
            </Typography>
          )}
        </ListItem>
      </List>
    </Layout>
  )
}

export async function getServerSideProps(ctx) {
  const { params } = ctx
  const { slug } = params

  await db.connect()
  const product = await Product.findOne({ slug }, '-reviews').lean()
  await db.disconnect()
  return {
    props: {
      product: db.convertDocToObj(product)
    }
  }

}
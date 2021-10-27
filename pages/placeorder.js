import React from 'react'
import dynamic from 'next/dynamic'
import Store from '../utils/store'
import Layout from '../components/Layout'
import { Grid, TableContainer, Table, Typography, TableHead, TableRow, TableCell, TableBody, CircularProgress, Link, Button, Card, List, ListItem } from '@material-ui/core'
import NextLink from 'next/link'
import Image from 'next/image'
import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import useStyles from '../utils/styles'
import CheckoutWizard from '../components/CheckoutWizard'
import { useSnackbar } from 'notistack'
import { getError } from '../utils/error'
import axios from 'axios'
import Cookies from 'js-cookie'
function PlaceOrder() {
  const classes = useStyles()
  const router = useRouter()
  const { state, dispatch } = useContext(Store)
  const { userInfo, cart: { cartItems, shippingAddress, paymentMethod } } = state
  const round2 = num => Math.round((num * 100) / 100)
  const itemsPrice = cartItems.reduce((a, c) => a + c.price * c.quantity, 0)
  const shippingPrice = round2(itemsPrice > 200 ? 0 : 15)
  const taxPrice = round2(itemsPrice * 0.15)
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice)

  useEffect(() => {
    if (!paymentMethod) {
      router.push('/payment');
    }
    if (cartItems.length === 0) {
      router.push('/cart');
    }
  }, []);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(false)
  const placeOrderHandler = async () => {
    closeSnackbar()
    try {
      setLoading(true)
      const { data } = await axios.post('/api/orders', {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice
      }, {
        headers: {
          authorization: `Bearer ${userInfo.token}`
        }
      })
      dispatch({ type: 'CART_CLEAR' })
      Cookies.remove('cartItems')
      setLoading(false)
      router.push(`/order/${data._id}`)
    } catch (err) {
      setLoading(false)
      enqueueSnackbar(getError(err), { variant: 'error' })
    }

  }
  return (
    <Layout title="Seu pedido">
      <CheckoutWizard activeStep={3} />
      <Typography component="h1" variant="h1">
        Seu pedido
      </Typography>
      <Grid container spacing={1}>
        <Grid item md={9} xs={12}>
          <Card className={classes.placeOrderSection}>
            <List>
              <ListItem>
                <Typography component="h2" variant="h2">Informações de Entrega</Typography>
              </ListItem>
              <ListItem>
                {shippingAddress.fullName}, {shippingAddress.address}, &nbsp;
                {shippingAddress.city}, {shippingAddress.postalCode}, &nbsp;
                {shippingAddress.country}
              </ListItem>
            </List>
          </Card>
          <Card className={classes.placeOrderSection}>
            <List>
              <ListItem>
                <Typography component="h2" variant="h2">Método de Pagamento</Typography>
              </ListItem>
              <ListItem>
                {paymentMethod}
              </ListItem>
            </List>
          </Card>
          <Card className={classes.placeOrderSection}>
            <List>
              <ListItem>
                <Typography component="h2" variant="h2">Produtos no pedido</Typography>
              </ListItem>
              <ListItem>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Imagem</TableCell>
                        <TableCell>Nome</TableCell>
                        <TableCell align="right">Qtd.</TableCell>
                        <TableCell align="right">Tamanho</TableCell>
                        <TableCell align="right">Preço</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cartItems.map((item) => (
                        <TableRow key={item._id}>
                          <TableCell>
                            <NextLink href={`/product/${item.slug}`} passHref>
                              <Link>
                                <Image src={item.image} alt={item.name} width={50} height={50}></Image>
                              </Link>
                            </NextLink>
                          </TableCell>
                          <TableCell>
                            <NextLink href={`/product/${item.slug}`} passHref>
                              <Link>
                                <Typography>{item.name}</Typography>
                              </Link>
                            </NextLink>
                          </TableCell>
                          <TableCell align="right">
                            <Typography>{item.quantity}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography>{item.size}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            R${item.price.toFixed(2).toString().replace('.', ',')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ListItem>
            </List>

          </Card>

        </Grid>
        <Grid item md={3} xs={12}>
          <Card className={classes.placeOrderSection}>
            <List>
              <ListItem>
                <Typography variant="h2">
                  Resumo do Pedido
                </Typography>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Itens:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">R${itemsPrice.toFixed(2).toString().replace('.', ',')}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Imposto:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">R${taxPrice.toFixed(2).toString().replace('.', ',')}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Frete:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">{shippingPrice > 0 ? `R$${shippingPrice.toFixed(2).toString().replace('.', ',')}` : 'Gratis'}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography><strong>Total:</strong></Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right"><strong>R${totalPrice.toFixed(2).toString().replace('.', ',')}</strong></Typography>
                  </Grid>
                </Grid>
              </ListItem>
              {!loading &&
                <ListItem>
                  <Button onClick={placeOrderHandler} variant="contained" color="primary" fullWidth>Fazer pedido</Button>
                </ListItem>
              }
              {loading &&
                <ListItem>
                  <Button variant="contained" color="primary" fullWidth><CircularProgress color="secondary" /></Button>
                </ListItem>
              }
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  )
}

export default dynamic(() => Promise.resolve(PlaceOrder), { ssr: false })

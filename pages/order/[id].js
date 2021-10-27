import React, { useReducer } from 'react'
import dynamic from 'next/dynamic'
import Store from '../../utils/store'
import Layout from '../../components/Layout'
import { Grid, TableContainer, Table, Typography, TableHead, TableRow, TableCell, TableBody, CircularProgress, Link, Card, List, ListItem, Button } from '@material-ui/core'
import NextLink from 'next/link'
import Image from 'next/image'
import { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import useStyles from '../../utils/styles'
import { useSnackbar } from 'notistack'
import { getError } from '../../utils/error'
import axios from 'axios'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: true, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false, errorPay: action.payload };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false, errorPay: '' };
    case 'DELIVER_REQUEST':
      return { ...state, loadingDeliver: true };
    case 'DELIVER_SUCCESS':
      return { ...state, loadingDeliver: false, successDeliver: true };
    case 'DELIVER_FAIL':
      return { ...state, loadingDeliver: false, errorDeliver: action.payload };
    case 'DELIVER_RESET':
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
        errorDeliver: '',
      };
    default: state;
  }
}

function Order({ params }) {
  const orderId = params.id
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer()
  const classes = useStyles()
  const router = useRouter()
  const { state } = useContext(Store)
  const { userInfo } = state


  const [{ loading, error, order, successPay, loadingDeliver, successDeliver }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: ''
  })
  const { shippingAddress, paymentMethod, orderItems, itemsPrice, taxPrice, shippingPrice, totalPrice, isPaid, paidAt, isDelivered, deliveredAt } = order

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login')
    }
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' })
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` }
        })
        dispatch({ type: 'FETCH_SUCCESS', payload: data })
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
      }
    }
    if (!order._id || successPay || successDeliver || (order._id && order._id !== orderId)) {
      fetchOrder()
      if (successPay) {
        dispatch({ type: 'PAY_RESET' })
      }
      if (successDeliver) {
        dispatch({ type: 'DELIVER_RESET' })
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal', {
          headers: { authorization: `Bearer ${userInfo.token}` }
        })
        paypalDispatch({
          type: 'resetOptions', value: {
            'client-id': clientId,
            currency: 'BRL'
          }
        })
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' })
      }
      loadPaypalScript()
    }
  }, [order, successPay, successDeliver]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  function createOrder(data, actions) {
    closeSnackbar()
    return actions.order.create({
      purchase_units: [
        {
          amount: { value: totalPrice }
        }
      ]
    }).then((orderID) => { return orderID })
  }
  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: 'PAY_REQUEST' })
        const { data } = await axios.put(`/api/orders/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` }
          })
        dispatch({ type: 'PAY_SUCCESS', payload: data })
        enqueueSnackbar('Pedido pago com sucesso', { variant: 'success' })
      } catch (err) {
        dispatch({ type: 'PAY_FAIL', payload: getError(err) })
        enqueueSnackbar(getError(err), { variant: 'error' })
      }
    })
  }

  function onError(err) {
    enqueueSnackbar(getError(err), { variant: 'error' })
  }
  async function deliverOrderHandler() {
    try {
      dispatch({ type: 'DELIVER_REQUEST' });
      const { data } = await axios.put(
        `/api/orders/${order._id}/deliver`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'DELIVER_SUCCESS', payload: data });
      enqueueSnackbar('Pedido entregue com sucesso', { variant: 'success' });
    } catch (err) {
      dispatch({ type: 'DELIVER_FAIL', payload: getError(err) })
      enqueueSnackbar(getError(err), { variant: 'error' })
    }
  }
  return (
    <Layout title={`Detalhes do Pedido ${orderId}`}>
      <Typography component="h1" variant="h1">
        Pedido {orderId}
      </Typography>
      {loading
        ? (<CircularProgress />)
        : error ? (
          <Typography className={classes.error}>{error}</Typography>
        )
          : (
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
                    <ListItem>
                      Status: {isDelivered ? `Entregue em ${deliveredAt}` : 'Não entregue'}
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
                    <ListItem>
                      Status: {isPaid ? `Pago em ${paidAt}` : 'Não pago'}
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
                            {orderItems.map((item) => (
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
                    {
                      !isPaid && (
                        <ListItem>
                          {isPending ? (<CircularProgress />) :
                            (
                              <div className={classes.fullWidth}>
                                <PayPalButtons createOrder={createOrder} onApprove={onApprove} onError={onError}></PayPalButtons>
                              </div>
                            )}
                        </ListItem>
                      )

                    }
                    {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                      <ListItem>
                        {loadingDeliver && <CircularProgress />}
                        <Button
                          fullWidth
                          variant="contained"
                          color="primary"
                          onClick={deliverOrderHandler}
                        >
                          Entregar pedido
                        </Button>
                      </ListItem>
                    )}

                  </List>
                </Card>
              </Grid>
            </Grid>
          )}

    </Layout>
  )
}


export async function getServerSideProps({ params }) {
  return { props: { params } }
}

export default dynamic(() => Promise.resolve(Order), { ssr: false })

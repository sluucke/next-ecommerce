import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useReducer } from 'react'
import { Grid, TableContainer, Table, Typography, CircularProgress, Card, List, ListItem, TableHead, TableRow, Button, ListItemText, TableCell, TableBody } from '@material-ui/core'
import Store from '../utils/store'
import axios from 'axios'
import { getError } from '../utils/error'
import Layout from '../components/Layout'
import useStyles from '../utils/styles'
import NextLink from 'next/link'
function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: true, error: action.payload };
    default: state;
  }
}

function OrderHistory() {
  const { state } = useContext(Store)
  const { userInfo } = state
  const classes = useStyles()
  const router = useRouter()

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: ''
  })

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }
    const fetchOrders = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/history`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchOrders();
  }, []);

  function formatDate(data) {
    const date = new Date(data)
    const formatedDate = ((date.getDate())) + "/" + ((date.getMonth() + 1)) + "/" + date.getFullYear()
    return formatedDate
  }
  return (
    <Layout title='Compras'>
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.placeOrderSection}>
            <List>
              <NextLink href="/profile" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Perfil de Usu??rio"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/order-history" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="Compras"></ListItemText>
                </ListItem>
              </NextLink>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card className={classes.placeOrderSection}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h1">
                  Compras
                </Typography>
              </ListItem>
              <ListItem>
                {loading
                  ? (<CircularProgress />)
                  : error ? (
                    <Typography className={classes.error}>{error}</Typography>
                  )
                    : (
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>ID</TableCell>
                              <TableCell>DATA</TableCell>
                              <TableCell>TOTAL</TableCell>
                              <TableCell>STATUS</TableCell>
                              <TableCell>ENTREGUE</TableCell>
                              <TableCell>A????O</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {orders.map((order) => (
                              <TableRow key={order._id}>
                                <TableCell>{order._id.substring(20, 24)}</TableCell>
                                <TableCell>{formatDate(order.createdAt)}</TableCell>
                                <TableCell>R${order.totalPrice.toFixed(2).toString().replace('.', ',')}</TableCell>
                                <TableCell>
                                  {order.isPaid
                                    ? `Pago em ${formatDate(order.paidAt)}`
                                    : 'N??o pago'}
                                </TableCell>
                                <TableCell>
                                  {order.isDelivered
                                    ? `Entregue em ${formatDate(order.deliveredAt)}`
                                    : 'N??o entregue'}
                                </TableCell>
                                <TableCell>
                                  <NextLink href={`/order/${order._id}`} passHref>
                                    <Button variant="contained">Detalhes</Button>
                                  </NextLink>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>

    </Layout >
  )
}


export default dynamic(() => Promise.resolve(OrderHistory), { ssr: false })

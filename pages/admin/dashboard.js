import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useReducer } from 'react'
import { Grid, Typography, CircularProgress, Card, List, ListItem, Button, ListItemText, CardContent, CardActions } from '@material-ui/core'
import Store from '../../utils/store'
import axios from 'axios'
import { getError } from '../../utils/error'
import Layout from '../../components/Layout'
import useStyles from '../../utils/styles'
import NextLink from 'next/link'

import { Bar } from 'react-chartjs-2'
function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, summary: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

function AdminDashboard() {
  const { state } = useContext(Store)
  const { userInfo } = state
  const classes = useStyles()
  const router = useRouter()

  const [{ loading, error, summary }, dispatch] = useReducer(reducer, {
    loading: true,
    summary: { salesData: [] },
    error: ''
  })

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/summary`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, []);

  return (
    <Layout title='Painel Administrador'>
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.placeOrderSection}>
            <List>
              <NextLink href="/admin/dashboard" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="Painel Administrador"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/orders" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Lista de Pedidos"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/products" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Lista de Produtos"></ListItemText>
                </ListItem>
              </NextLink>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card className={classes.placeOrderSection}>
            <List>
              <ListItem>
                {loading
                  ? (<CircularProgress />)
                  : error ? (
                    <Typography className={classes.error}>{error}</Typography>
                  )
                    : (
                      <Grid container spacing={5}>
                        <Grid item md={3}>
                          <Card raised>
                            <CardContent>
                              <Typography variant="h1">R$ {summary.ordersPrice}</Typography>
                              <Typography>Vendidos</Typography>
                            </CardContent>
                            <CardActions>
                              <NextLink href="/admin/orders" passHref>
                                <Button size="small" color="primary">
                                  Ver vendas
                                </Button>
                              </NextLink>
                            </CardActions>
                          </Card>
                        </Grid>
                        <Grid item md={3}>
                          <Card raised>
                            <CardContent>
                              <Typography variant="h1">
                                {summary.ordersCount}
                              </Typography>
                              <Typography>Pedidos</Typography>
                            </CardContent>
                            <CardActions>
                              <NextLink href="/admin/orders" passHref>
                                <Button si ze="small" color="primary">
                                  Ver pedidos
                                </Button>
                              </NextLink>
                            </CardActions>
                          </Card>
                        </Grid>
                        <Grid item md={3}>
                          <Card raised>
                            <CardContent>
                              <Typography variant="h1">
                                {summary.productsCount}
                              </Typography>
                              <Typography>Produtos</Typography>
                            </CardContent>
                            <CardActions>
                              <NextLink href="/admin/products" passHref>
                                <Button si ze="small" color="primary">
                                  Ver produtos
                                </Button>
                              </NextLink>
                            </CardActions>
                          </Card>
                        </Grid>
                        <Grid item md={3}>
                          <Card raised>
                            <CardContent>
                              <Typography variant="h1">
                                {summary.usersCount}
                              </Typography>
                              <Typography>Usuários</Typography>
                            </CardContent>
                            <CardActions>
                              <NextLink href="/admin/users" passHref>
                                <Button si ze="small" color="primary">
                                  Ver usuários
                                </Button>
                              </NextLink>
                            </CardActions>
                          </Card>
                        </Grid>
                      </Grid>
                    )}
              </ListItem>
              <ListItem>
                <Typography component="h1" variant="h1">
                  Gráficos de Vendas
                </Typography>
              </ListItem>
              <ListItem>
                <Bar
                  data={{
                    labels: summary.salesData.map((x) => x._id),
                    datasets: [
                      {
                        label: 'Vendas',
                        backgroundColor: 'rgba(241, 108, 131, 1)',
                        data: summary.salesData.map((x) => x.totalSales)
                      }
                    ]

                  }}
                  options={{
                    legend: { display: true, position: 'right' }
                  }}
                ></Bar>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>

    </Layout >
  )
}


export default dynamic(() => Promise.resolve(AdminDashboard), { ssr: false })

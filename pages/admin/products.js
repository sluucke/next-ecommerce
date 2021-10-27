import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useReducer } from 'react'
import { Grid, TableContainer, Table, Typography, CircularProgress, Card, List, ListItem, TableHead, TableRow, Button, ListItemText, TableCell, TableBody } from '@material-ui/core'
import Store from '../../utils/store'
import axios from 'axios'
import { getError } from '../../utils/error'
import Layout from '../../components/Layout'
import useStyles from '../../utils/styles'
import NextLink from 'next/link'
import Image from 'next/image'
import { useSnackbar } from 'notistack'

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, products: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: true, error: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreate: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default: state;
  }
}

function AdminDashboard() {
  const { state } = useContext(Store)
  const { userInfo } = state
  const classes = useStyles()
  const router = useRouter()

  const [{ loading, error, products, loadingCreate, successDelete, loadingDelete }, dispatch] = useReducer(reducer, {
    loading: true,
    products: [],
    error: ''
  })

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/products`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' })
    } else {
      fetchData();
    }
  }, [successDelete]);

  const { enqueueSnackbar } = useSnackbar()
  const createHandler = async () => {
    if (!window.confirm('Você tem certeza?')) {
      return
    }
    try {
      dispatch({ type: 'CREATE_REQUEST' })
      const { data } = await axios.post(
        `/api/admin/products`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'CREATE_SUCCESS' })
      enqueueSnackbar('Produto criado com sucesso', { variant: 'success' })
      router.push(`/admin/product/${data.product._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  }
  const deleteHandler = async (productId) => {
    if (!window.confirm('Você tem certeza?')) {
      return
    }
    try {
      dispatch({ type: 'DELETE_REQUEST' })
      await axios.delete(`/api/admin/products/${productId}`, {
        headers: { authorization: `Bearer ${userInfo.token}` }
      })
      dispatch({ type: 'DELETE_SUCCESS' })
      enqueueSnackbar('Produto deletado com sucesso', { variant: 'success' })

    } catch (err) {
      dispatch({ type: 'DELETE_FAIL' });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  }
  return (
    <Layout title='Produtos'>
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.placeOrderSection}>
            <List>
              <NextLink href="/admin/dashboard" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Painel Administrador"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/orders" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Lista de Pedidos"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/products" passHref>
                <ListItem selected button component="a">
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
                <Grid container alignItems="center">
                  <Grid item xs={6}>
                    <Typography component="h1" variant="h1">
                      Produtos
                    </Typography>
                    {loadingDelete && <CircularProgress />}
                  </Grid>
                  <Grid align="right" item xs="6">
                    <Button onClick={createHandler} color="primary" variant="contained">Criar</Button>
                    {loadingCreate && <CircularProgress />}
                  </Grid>
                </Grid>
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
                              <TableCell>IMAGEM</TableCell>
                              <TableCell>NOME</TableCell>
                              <TableCell>CATEGORIA</TableCell>
                              <TableCell>PREÇO</TableCell>
                              <TableCell>STOQUE</TableCell>
                              <TableCell>AVALIAÇÕES</TableCell>
                              <TableCell>AÇÃO</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {products.map((product) => (
                              <TableRow key={product._id}>
                                <TableCell>{product._id.substring(20, 24)}</TableCell>
                                <TableCell><Image src={product.image} alt={product.name} width={50} height={50} /> </TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell>R${product.price.toFixed(2).toString().replace('.', ',')}</TableCell>
                                <TableCell>
                                  {product.countInStock}
                                </TableCell>
                                <TableCell>
                                  {product.rating}
                                </TableCell>
                                <TableCell>
                                  <NextLink
                                    href={`/admin/product/${product._id}`}
                                    passHref
                                  >
                                    <Button size="small" variant="contained">
                                      Editar
                                    </Button>
                                  </NextLink>
                                  <Button onClick={() => deleteHandler(product._id)} size="small" variant="contained">
                                    Deletar
                                  </Button>
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


export default dynamic(() => Promise.resolve(AdminDashboard), { ssr: false })

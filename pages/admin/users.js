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
import { useSnackbar } from 'notistack'
function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, users: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: true, error: action.payload };
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

function AdminUsers() {
  const { state } = useContext(Store)
  const { userInfo } = state
  const classes = useStyles()
  const router = useRouter()

  const [{ loading, error, users, successDelete, loadingDelete }, dispatch] = useReducer(reducer, {
    loading: true,
    users: [],
    error: ''
  })

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/users`, {
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

  const deleteHandler = async (userId) => {
    if (!window.confirm('Você tem certeza?')) {
      return
    }
    try {
      dispatch({ type: 'DELETE_REQUEST' })
      await axios.delete(`/api/admin/users/${userId}`, {
        headers: { authorization: `Bearer ${userInfo.token}` }
      })
      dispatch({ type: 'DELETE_SUCCESS' })
      enqueueSnackbar('Usuário deletado com sucesso', { variant: 'success' })
    } catch (err) {
      dispatch({ type: 'DELETE_FAIL' });
      enqueueSnackbar(getError(err), { variant: 'error' })
    }
  }

  return (
    <Layout title='Usuários'>
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
                <ListItem button component="a">
                  <ListItemText primary="Lista de Produtos"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/users" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="Lista de Usuários"></ListItemText>
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
                  Usuários
                </Typography>
                {loadingDelete && <CircularProgress />}
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
                              <TableCell>NOME</TableCell>
                              <TableCell>EMAIL</TableCell>
                              <TableCell>ADMIN</TableCell>
                              <TableCell>AÇÕES</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {users.map((user) => (
                              <TableRow key={user._id}>
                                <TableCell>{user._id.substring(20, 24)}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.isAdmin ? 'SIM' : 'NÃO'}</TableCell>
                                <TableCell>
                                  <NextLink href={`/admin/user/${user._id}`} passHref>
                                    <Button size="small" variant="contained"> EDitar</Button>
                                  </NextLink>
                                  <Button onClick={() => deleteHandler(user._id)} size="small" variant="contained">Deletar</Button>
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


export default dynamic(() => Promise.resolve(AdminUsers), { ssr: false })

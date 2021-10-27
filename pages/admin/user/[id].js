import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useReducer, useState } from 'react'
import { Grid, Typography, CircularProgress, Card, List, ListItem, Button, ListItemText, FormControlLabel, Checkbox, TextField } from '@material-ui/core'
import Store from '../../../utils/store'
import axios from 'axios'
import { getError } from '../../../utils/error'
import Layout from '../../../components/Layout'
import useStyles from '../../../utils/styles'
import NextLink from 'next/link'
import { useSnackbar } from 'notistack'
import { Controller, useForm } from 'react-hook-form'
function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, users: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: true, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true, errorUpdate: '' };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false, errorUpdate: '' };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: '',
      };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default: state;
  }
}

function UserEdit({ params }) {
  const userId = params.id
  const { state } = useContext(Store)

  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: ''
  })
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue
  } = useForm();

  const [isAdmin, setIsAdmin] = useState(false)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const classes = useStyles()
  const router = useRouter()
  const { userInfo } = state


  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
    }
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/users/${userId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        setIsAdmin(data.isAdmin);
        setValue('name', data.name);
        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, []);

  const submitHandler = async ({ name }) => {
    closeSnackbar()
    try {
      dispatch({ type: 'UPDATE_REQUEST' })
      await axios.put(`/api/admin/users/${userId}`, {
        name,
        isAdmin
      }, {
        headers: { authorization: `Bearer ${userInfo.token}` }
      })
      dispatch({ type: 'UPDATE_SUCCESS' })
      enqueueSnackbar('Usuário atualizado com sucesso', { variant: 'success' })
      router.push('/admin/users')
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL', payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: 'error' });

    }
  }
  return (
    <Layout title={`Editar usuário ${userId}`}>
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
                  Editar Usuário {userId}
                </Typography>
              </ListItem>
              <ListItem>
                {loading && <CircularProgress></CircularProgress>}
                {error && (
                  <Typography className={classes.error}>{error}</Typography>
                )}
              </ListItem>
              {!loading && (


                <ListItem>
                  <form
                    onSubmit={handleSubmit(submitHandler)}
                    className={classes.form}
                  >
                    <List>
                      <ListItem>
                        <Controller
                          name="name"
                          control={control}
                          defaultValue=""
                          rules={{
                            required: true,
                          }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="name"
                              label="Nome"
                              error={Boolean(errors.name)}
                              helperText={errors.name ? 'Nome é necessário' : ''}
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>
                      <ListItem>
                        <FormControlLabel
                          label="Admin"
                          control={
                            <Checkbox
                              onClick={(e) => setIsAdmin(e.target.checked)}
                              checked={isAdmin}
                              name="isAdmin"
                              color="primary"
                            />
                          }
                        ></FormControlLabel>
                      </ListItem>
                      <ListItem>
                        <Button
                          variant="contained"
                          type="submit"
                          fullWidth
                          color="primary"
                        >
                          {loadingUpdate ? <CircularProgress color="secondary" /> : 'Atualizar'}
                        </Button>

                      </ListItem>
                    </List>
                  </form>
                </ListItem>
              )}
            </List>
          </Card>
        </Grid>
      </Grid>

    </Layout >
  )
}

export async function getServerSideProps({ params }) {
  return {
    props: {
      params
    }
  }
}

export default dynamic(() => Promise.resolve(UserEdit), { ssr: false })

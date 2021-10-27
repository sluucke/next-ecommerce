import { Button, Link, List, ListItem, TextField, Typography } from '@material-ui/core'
import React, { useContext, useEffect } from 'react'
import Layout from '../components/Layout'
import useStyles from '../utils/styles'
import NextLink from 'next/link'
import axios from 'axios'
import Store from '../utils/store'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { Controller, useForm } from 'react-hook-form'
import { useSnackbar } from 'notistack'
import '@mui/material/Slide'
import { getError } from '../utils/error'
export default function Login() {
  const { handleSubmit, control, formState: { errors } } = useForm()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const router = useRouter()
  const { redirect } = router.query // login?redirect=/shipping
  const { state, dispatch } = useContext(Store)
  const { userInfo } = state
  useEffect(() => {
    if (userInfo) {
      router.push('/')
    }
  }, [])
  const classes = useStyles();
  const submitHandler = async ({ email, password }) => {
    closeSnackbar()
    try {
      const { data } = await axios.post('/api/users/login', {
        email, password
      })
      dispatch({ type: 'USER_LOGIN', payload: data });
      Cookies.set('userInfo', JSON.stringify(data));
      router.push(redirect || '/');
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' })
    }
  }
  return (
    <Layout title="Login">
      <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
        <Typography component="h1" variant="h1">Login</Typography>
        <List>
          <ListItem>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth id="email"
                  label="Email"
                  inputProps={{ type: 'email' }}
                  error={Boolean(errors.email)}
                  helperText={errors.email ? errors.email.type === 'pattern' ? 'Email não é válido' : 'Email é necessário' : ''}
                  {...field}
                >
                </TextField>)}>

            </Controller>

          </ListItem>
          <ListItem>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 6
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="password"
                  label="Senha"
                  inputProps={{ type: 'password' }}
                  error={Boolean(errors.password)}
                  helperText={errors.password ? errors.password.type === 'minLength' ? 'A senha precisa de no mínimo 5 caracteres' : 'Senha é necessário' : ''}
                  {...field}
                >
                </TextField>)}>
            </Controller>
          </ListItem>
          <ListItem>
            <Button variant="contained" type="submit" color="primary" fullWidth>Login</Button>
          </ListItem>
          <ListItem>
            Não tem uma conta? &nbsp; <NextLink href={`/register?redirect=${redirect || '/'}`} passHref><Link>Registrar</Link></NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  )
}

import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, } from 'react'
import { Grid, Typography, Card, List, ListItem, Button, ListItemText, TextField } from '@material-ui/core'
import Store from '../utils/store'
import axios from 'axios'
import { getError } from '../utils/error'
import Layout from '../components/Layout'
import useStyles from '../utils/styles'
import NextLink from 'next/link'
import { Controller, useForm } from 'react-hook-form'
import { useSnackbar } from 'notistack'
import Cookies from 'js-cookie'

function Profile() {
  const { state, dispatch } = useContext(Store)
  const { handleSubmit, control, formState: { errors }, setValue } = useForm()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const { userInfo } = state
  const classes = useStyles()
  const router = useRouter()

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
    }
    setValue('name', userInfo.name)
    setValue('email', userInfo.email)
  })

  const submitHandler = async ({ name, email, password, confirmPassword }) => {
    closeSnackbar()
    if (password !== confirmPassword) {
      enqueueSnackbar('As senhas não coincidem', { variant: 'error' })
      return;
    }
    try {
      const { data } = await axios.put('/api/users/profile', {
        name, email, password
      }, {
        headers: { authorization: `Bearer ${userInfo.token}` }
      })
      dispatch({ type: 'USER_LOGIN', payload: data });
      Cookies.set('userInfo', JSON.stringify(data));
      enqueueSnackbar('Perfil atualizado com sucesso', { variant: 'success' })

    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' })
    }
  }
  return (
    <Layout title='Perfil'>
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.placeOrderSection}>
            <List>
              <NextLink href="/profile" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="Perfil de Usuário"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/order-history" passHref>
                <ListItem button component="a">
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
                  Perfil
                </Typography>
              </ListItem>
              <ListItem>
                <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
                  <List>
                    <ListItem>
                      <Controller
                        name="name"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                          minLength: 2
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth id="name"
                            label="Nome"
                            inputProps={{ type: 'name' }}
                            error={Boolean(errors.name)}
                            helperText={errors.name ? errors.name.type === 'minLength' ? 'O nome precisa ser maior do que 1' : 'Nome é necessário' : ''}
                            {...field}
                          >
                          </TextField>)}>

                      </Controller>
                    </ListItem>
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
                          validate: (value) => (value === '' || value.length > 5 || 'A senha precisa de no mínimo 5 caracteres')
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="password"
                            label="Senha"
                            inputProps={{ type: 'password' }}
                            error={Boolean(errors.password)}
                            helperText={errors.password ? 'A senha precisa de no mínimo 5 caracteres' : ''}
                            {...field}
                          >
                          </TextField>)}>
                      </Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="confirmPassword"
                        control={control}
                        defaultValue=""
                        rules={{
                          validate: (value) => (value === '' || value.length > 5 || 'A senha precisa de no mínimo 5 caracteres')
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="confirmPassword"
                            label="Confirme a senha"
                            inputProps={{ type: 'password' }}
                            error={Boolean(errors.confirmPassword)}
                            helperText={errors.password ? 'A senha precisa de no mínimo 5 caracteres' : ''}
                            {...field}
                          >
                          </TextField>)}>
                      </Controller>
                    </ListItem>
                    <ListItem>
                      <Button variant="contained" type="submit" color="primary" fullWidth>Atualizar</Button>
                    </ListItem>

                  </List>
                </form>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>

    </Layout >
  )
}


export default dynamic(() => Promise.resolve(Profile), { ssr: false })

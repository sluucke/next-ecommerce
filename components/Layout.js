import Head from 'next/head'
import NextLink from 'next/link'
import { AppBar, Toolbar, Typography, Container, Link, Tooltip, createTheme, Menu, MenuItem, CssBaseline, ThemeProvider, Switch, Badge, Button } from '@material-ui/core'
import useStyles from '../utils/styles.js'
import LocalMallIcon from '@material-ui/icons/LocalMall'
import { useContext, useState } from 'react'
import Store from '../utils/store'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
export default function Layout({ title, description, children }) {
  const router = useRouter()
  const { state, dispatch } = useContext(Store)
  const { darkMode, cart, userInfo } = state
  const theme = createTheme({
    typography: {
      h1: {
        fontSize: '1.8rem',
        fontWeight: 400,
        margin: '1rem 0'
      },
      h2: {
        fontSize: '1.4rem',
        fontWeight: 400,
        margin: '1rem 0'
      },
      subtitle2: {
        fontSize: '1.2rem',
        fontFamily: 'Roboto, serif',
        fontWeight: 'normal'
      },
      body1: {
        fontWeight: 'normal'
      },


    },
    palette: {
      type: darkMode ? 'dark' : 'light',
      background: {
        default: darkMode ? '#121214' : '#fafafa',
        paper: darkMode ? '#202024' : '#ffffff',
      },
      primary: {
        main: '#F16C83'
      },
      secondary: {
        main: darkMode ? '#121214' : '#ffffff'
      },
    }
  })
  const classes = useStyles()
  const darkModeChangeHandler = () => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' })
    const newDarkMode = !darkMode
    Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF')
  }
  const [anchorEl, setAnchorEl] = useState(null)
  const loginClickHandler = (e) => {
    setAnchorEl(e.currentTarget)
  }
  const loginMenuCloseHandler = (e, redirect) => {
    setAnchorEl(null)
    if (redirect) {
      router.push(redirect)
    }
  }
  const logoutClickHandler = () => {
    setAnchorEl(null)
    dispatch({ type: 'USER_LOGOUT' })
    Cookies.remove('userInfo')
    Cookies.remove('cartItems')
    router.push('/')
  }
  return (
    <div>
      <Head>
        <title>{title ? `${title} - urStyle` : 'urStyle'}</title>
        {description && <meta name="description" content={description} />}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static" className={classes.navbar} color="secondary" elevation={0}>
          <Toolbar>
            <NextLink href="/" passHref>
              <Link style={{ textDecoration: 'none' }}>
                <Typography className={classes.brand}>urStyle</Typography>
              </Link>
            </NextLink>
            <div className={classes.grow}>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Switch checked={darkMode} onChange={darkModeChangeHandler} color="primary"></Switch>
              <NextLink href="/cart" passHref>
                <Link style={{ textDecoration: 'none' }}>
                  <Tooltip title="Carrinho de compras">
                    {cart.cartItems.length > 0 ? <Badge color="primary" badgeContent={cart.cartItems.length}><Typography><LocalMallIcon style={{ verticalAlign: 'middle' }} /></Typography></Badge> : <Typography><LocalMallIcon style={{ verticalAlign: 'middle' }} /></Typography>}
                    {/* <Typography><LocalMallIcon style={{ verticalAlign: 'middle' }}/></Typography> */}
                  </Tooltip>
                </Link>
              </NextLink>
              {userInfo ? (
                <>
                  <Button
                    className={classes.navbarButton}
                    aria-controls="basic-menu"
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={loginClickHandler}
                  >
                    {userInfo.name}
                  </Button>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={loginMenuCloseHandler}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                  >
                    <MenuItem onClick={(e) => loginMenuCloseHandler(e, '/profile')}>Perfil</MenuItem>
                    <MenuItem onClick={(e) => loginMenuCloseHandler(e, '/order-history')}>Compras</MenuItem>
                    {userInfo.isAdmin && (
                      <MenuItem
                        onClick={(e) =>
                          loginMenuCloseHandler(e, '/admin/dashboard')
                        }
                      >
                        Painel Administrador
                      </MenuItem>
                    )}
                    <MenuItem onClick={logoutClickHandler}>Sair</MenuItem>
                  </Menu>
                </>
              ) :
                (
                  <NextLink href="/login" passHref>
                    <Link style={{ textDecoration: 'none' }}>
                      <Typography>Entrar</Typography>
                    </Link>
                  </NextLink>
                )}
            </div>
          </Toolbar>
        </AppBar>
        <Container className={classes.main}>
          {children}
        </Container>
        <footer className={classes.footer}>
          <Typography>Todos os direitos reservados. urStyle</Typography>
        </footer>
      </ThemeProvider>

    </div>
  );
}


import Head from 'next/head'
import NextLink from 'next/link'
import { AppBar, Toolbar, Typography, Container, Link, Tooltip, createTheme, Menu, MenuItem, CssBaseline, ThemeProvider, Switch, Badge, Button, IconButton, Drawer, ListItemText, ListItem, Divider, List, InputBase } from '@material-ui/core'
import useStyles from '../utils/styles.js'
import MenuIcon from '@material-ui/icons/Menu'
import LocalMallIcon from '@material-ui/icons/LocalMall'
import CancelIcon from '@material-ui/icons/Cancel'
import SearchIcon from '@material-ui/icons/Search';
import { useContext, useEffect, useState } from 'react'
import Store from '../utils/store'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import axios from 'axios'
import { getError } from '../utils/error';
import { Box } from '@mui/system'
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
  const [siderbarVisible, setSiderbarVisible] = useState(false)
  const sidebarOpenHandler = () => {
    setSiderbarVisible(true)
  }
  const sidebarCloseHandler = () => {
    setSiderbarVisible(false)
  }

  const [categories, setCategories] = useState([])

  const { enqueueSnackbar } = useSnackbar()

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`/api/products/categories/`)
      setCategories(data)
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  }
  const [query, setQuery] = useState('')
  const queryChangeHandler = (e) => {
    setQuery(e.target.value)
  }
  const submitHandler = (e) => {
    e.preventDefault()
    router.push(`/search?query=${query}`)
  }

  useEffect(() => {
    fetchCategories()
  }, [])


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
          <Toolbar className={classes.toolbar}>
            <Box display="flex" alignItems="center">
              <IconButton edge="start" aria-label="open drawer" onClick={sidebarOpenHandler} className={classes.menuButton}>
                <MenuIcon className={classes.navbarButton} />
              </IconButton>
              <NextLink href="/" passHref>
                <Link style={{ textDecoration: 'none' }}>
                  <Typography className={classes.brand}>urStyle</Typography>
                </Link>
              </NextLink>
            </Box>
            <Drawer anchor="left" open={siderbarVisible} onClose={sidebarCloseHandler}>
              <List>
                <ListItem>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography>Ordernar por categoria</Typography>
                    <IconButton
                      aria-label="close"
                      onClick={sidebarCloseHandler}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Box>
                </ListItem>
                <Divider light />
                {categories.map((category) => (
                  <NextLink
                    key={category}
                    href={`/search?category=${category}`}
                    passHref
                  >
                    <ListItem
                      button
                      component="a"
                      onClick={sidebarCloseHandler}
                    >
                      <ListItemText primary={category}></ListItemText>
                    </ListItem>
                  </NextLink>
                ))}
              </List>
            </Drawer>
            <div className={classes.searchSection}>
              <form onSubmit={submitHandler} className={classes.searchForm}>
                <InputBase name="query" className={classes.searchInput} placeholder="Pesquise por produtos ou marcas" onChange={queryChangeHandler} />
                <IconButton type="submit" className={classes.iconButton} aria-label="search">
                  <SearchIcon />
                </IconButton>
              </form>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Switch checked={darkMode} onChange={darkModeChangeHandler} color="primary"></Switch>
              <NextLink href="/cart" passHref>
                <Link style={{ textDecoration: 'none' }}>
                  <Tooltip title="Carrinho de compras">
                    <Typography component="span">
                      {cart.cartItems.length > 0 ? <Badge color="primary" badgeContent={cart.cartItems.length}><Typography><LocalMallIcon style={{ verticalAlign: 'middle' }} /></Typography></Badge> : <Typography><LocalMallIcon style={{ verticalAlign: 'middle' }} /></Typography>}
                    </Typography>
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
                      <Typography component="span">Entrar</Typography>
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


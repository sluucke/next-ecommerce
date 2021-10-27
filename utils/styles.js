import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles({
  navbar: {
    // backgroundColor: '#FFFFFF',
    boxShadow: 0,
    marginBottom: 10,
    '& a': {
      color: '#F16C83',
      textDecoration: 'none',
      marginLeft: 10
    }
  },
  brand: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
    fontFamily: 'serif'
  },
  price: {
    color: '#F16C83',
    fontSize: '1.2rem'
  },
  main: {
    minHeight: '80vh'
  },
  grow: {
    flexGrow: 1
  },
  footer: {
    textAlign: 'center',
    marginTop: 50
  },
  section: {
    marginTop: 20,
    marginBottom: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
  },
  card: {
    boxShadow: '1, 1, 1, 2 rgba(0,0,0,.2)'
  },
  sizes: {
    display: 'flex',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0.375rem',
    border: '1px solid #F16C83',
    margin: 2,
    cursor: 'pointer',
    transition: '.3s background ease-in-out',
    '&:hover': {
      backgroundColor: '#F16C83'
    }
  },
  primaryBtn: {
    backgroundColor: '#F16C83',
    borderRadius: 10,
    color: '#ffffff',
    fontSize: 16,
    '&:hover': {
      backgroundColor: '#F2758B'
    }
  },
  primaryLink: {
    cursor: 'pointer',
    borderBottom: '2px solid #F16C83',
    color: '#F16C83',
    textDecoration: 'none',
    transition: 'all .3s ease-in-out',
    '&:hover': {
      backgroundColor: 'rgba(241, 108, 131, .2)',
    }
  },
  form: {
    width: '100%',
    maxWidth: 800,
    margin: '0 auto'
  },
  navbarButton: {
    color: '#F16C83',
    textTransform: 'initial'
  },
  transparentBackground: {
    background: 'transparent'
  },
  placeOrderSection: {
    marginBottom: 10,
    marginTop: 20,
  },
  error: {
    color: '#f04040'
  },
  fullWidth: {
    width: '100%'
  }

})

export default useStyles
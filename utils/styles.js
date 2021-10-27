import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
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
  },
  error: {
    color: '#f04040'
  },
  fullWidth: {
    width: '100%'
  },
  reviewForm: {
    maxWidth: 800,
    width: '100%',
  },
  reviewItem: {
    marginRight: '1rem',
    borderRight: '1px #808080 solid',
    paddingRight: '1rem',
  },
  toolbar: {
    justifyContent: 'space-between',
  },
  menuButton: { padding: 0 },
  mt1: { marginTop: '1rem' },
  // search
  searchSection: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sort: {
    marginRight: 5,
  },
  searchForm: {
    border: '1px solid #F16C83',
    backgroundColor: '#ffffff',
    borderRadius: 5,
  },
  searchInput: {
    paddingLeft: 5,
    color: '#000000',
    '& ::placeholder': {
      color: '#606060',
    },
  },
  iconButton: {
    backgroundColor: '#F16C83',
    padding: 5,
    borderRadius: '0 5px 5px 0',
    '& span': {
      color: '#ffffff',
    },
    '&:hover': {
      backgroundColor: '#F2758B',
    }
  },
}))

export default useStyles
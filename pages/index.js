import Image from 'next/image'
import Layout from '../components/Layout.js'
import useStyles from '../utils/styles.js'
import { Grid, Typography, Button, } from '@material-ui/core'
import { MdKeyboardArrowRight } from 'react-icons/md'
import backgroundImage from '../assets/shopping.svg'
import db from '../utils/db'
import Product from '../models/Product'
import ProductItem from '../components/ProductItem'
export default function Home({ products }) {
  const classes = useStyles()
  return (
    <Layout>
      <div>
        <Grid container spacing={2}
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: '85vh' }}
        >
          <Grid item md={6} xs={12}>
            <Typography component="h2" variant="h2" style={{ fontSize: '2rem' }}>Crie seu própio estilo</Typography>
            <Typography component="p" variant="subtitle2">Cada mulher tem um estilo único, ajudamos a criar o seu próprio estilo porque você merece brilhar como uma estrela</Typography>
            <br />
            <Button className={classes.primaryBtn} style={{ marginTop: '8px' }} variant="contained" disableElevation endIcon={<MdKeyboardArrowRight />}>CRIAR MEU ESTILO</Button>
          </Grid>
          <Grid item md={6} xs={12}>
            <Image src={backgroundImage} alt="Shopping image" />
          </Grid>
        </Grid>
      </div>
      <div>
        <h1>Produtos</h1>
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item md={4} key={product.name}>
              <ProductItem product={product} />
            </Grid>
          ))}
        </Grid>
      </div>
    </Layout>
  )
}


export async function getServerSideProps() {
  await db.connect()
  const products = await Product.find({}, '-reviews').lean()
  await db.disconnect()
  return {
    props: {
      products: products.map(db.convertDocToObj)
    }
  }

}
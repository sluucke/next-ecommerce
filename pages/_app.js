import '../styles/globals.css'
import { useEffect } from 'react'
import { StoreProvider } from '../utils/store'
import { SnackbarProvider } from 'notistack'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])
  return (
    <SnackbarProvider anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
      <StoreProvider>
        <PayPalScriptProvider deferLoading={true}>
          <Component {...pageProps} />
        </PayPalScriptProvider>
      </StoreProvider>
    </SnackbarProvider>
  )
}

export default MyApp

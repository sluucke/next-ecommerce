import React from 'react'
import dynamic from 'next/dynamic'
import Store from '../utils/store'
import Layout from '../components/Layout'
import { Grid, TableContainer,Table, Typography, TableHead, TableRow, TableCell, TableBody, Link, Select, MenuItem, Button, Card, List, ListItem } from '@material-ui/core'
import NextLink from 'next/link'
import Image from 'next/image'
import { useContext } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

function CartScreen() {
    const router = useRouter()
    const { state, dispatch } = useContext(Store)
    const { cart: {cartItems}} = state
    const updateCartHandler = async (item, quantity, size) => {
        const { data } = await axios.get(`/api/products/${item._id}`)
        if(data.countInStock <= 0) {
            window.alert('Desculpe, o produto está fora de estoque')
            return;
        }
        dispatch({ type: 'CARD_ADD_ITEM', payload: {...item, quantity, size}})
    }
    const removeItemHandler = (item) => {
        dispatch({type: 'CART_REMOVE_ITEM', payload: item})
    }
    const checkoutHandler = () => {
        router.push('/shipping')
    }
    return (
        <Layout title="Carrinho de compras">
            <Typography component="h1" variant="h1">
                Seus pedidos
            </Typography>
            {cartItems.length === 0 ? (<div>Você não tem nenhum pedido. <NextLink href="/" passHref><Link>Voltar para produtos</Link></NextLink> </div>) : (
                <Grid container spacing={1}>
                    <Grid item md={9} xs={12}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Imagem</TableCell>
                                        <TableCell>Nome</TableCell>
                                        <TableCell align="right">Qtd.</TableCell>
                                        <TableCell align="right">Tamanho</TableCell>
                                        <TableCell align="right">Preço</TableCell>
                                        <TableCell align="right">Ações</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cartItems.map((item) => (
                                        <TableRow key={item._id}>
                                            <TableCell>
                                                <NextLink href={`/product/${item.slug}`} passHref>
                                                    <Link>
                                                        <Image src={item.image} alt={item.name} width={50} height={50}></Image>
                                                    </Link>
                                                </NextLink>
                                            </TableCell>
                                            <TableCell>
                                                <NextLink href={`/product/${item.slug}`} passHref>
                                                    <Link>
                                                        <Typography>{item.name}</Typography>
                                                    </Link>
                                                </NextLink>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Select value={item.quantity} onChange={(e) => updateCartHandler(item, e.target.value)}>
                                                    {[...Array(item.countInStock).keys()].map((x) => <MenuItem key={x+1} value={x+1}>{x + 1}</MenuItem>)}
                                                </Select>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Select value={item.size} onChange={(e) => updateCartHandler(item, item.quantity, e.target.value)}>
                                                    <MenuItem value="p">P</MenuItem>
                                                    <MenuItem value="m">M</MenuItem>
                                                    <MenuItem value="g">G</MenuItem>
                                                </Select>
                                            </TableCell>
                                            <TableCell align="right">
                                                R${item.price.toFixed(2).toString().replace('.',',')}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Button variant="contained" color="primary" onClick={() => removeItemHandler(item)}>X</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <Card>
                            <List>
                                <ListItem>
                                    <Typography variant="h2">
                                        Total ({cartItems.reduce((a, c) => a + c.quantity, 0)} {' '} items) : R$ {cartItems.reduce((a, c) => a + c.quantity * c.price, 0).toFixed(2).toString().replace('.', ',')}
                                    </Typography>
                                </ListItem>
                                <ListItem>
                                    <Button onClick={checkoutHandler} variant="contained" color="primary" fullWidth>Pagamento</Button>
                                </ListItem>
                            </List>

                        </Card>
                    </Grid>
                </Grid>
            )}
        </Layout>
    )
}

export default dynamic(() => Promise.resolve(CartScreen), {ssr: false})

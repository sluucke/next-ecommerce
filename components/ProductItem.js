import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Link
} from '@material-ui/core';
import React from 'react';
import NextLink from 'next/link';
import Rating from '@material-ui/lab/Rating';


export default function ProductItem({ product }) {
  return (
    <Card>
      <NextLink href={`/product/${product.slug}`} passHref>
        <CardActionArea>
          <CardMedia component="img" image={product.image} title={product.name} />
          <CardContent>
            <Typography>{product.name}</Typography>
            <Rating value={product.rating} readOnly></Rating>
          </CardContent>
        </CardActionArea>
      </NextLink>
      <CardActions>
        <NextLink href={`/product/${product.slug}`} passHref>
          <Link style={{ textDecoration: 'none' }}>R${product.price.toFixed(2).toString().replace('.', ',')}</Link>
        </NextLink>
      </CardActions>
    </Card>
  )
}
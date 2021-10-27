import bcrypt from 'bcryptjs'
const data = {
  users: [
    {
      name: 'John',
      email: 'admin@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: true,
    },
    {
      name: 'Jane',
      email: 'user@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: false,
    }
  ],
  products: [
    {
      name: 'Macacão Pantacour Estampa Preta',
      slug: 'macacao-pantacour-estampa-preta-mx',
      category: 'Macacão',
      image: '/images/macacaopantacour.jpg',
      price: 246.50,
      brand: 'MX',
      rating: 4.5,
      numReviews: 56,
      countInStock: 20,
      description: 'Macacão da marca MX. Confeccionado em poliamida. Toque macio, geladinho, com elasticidade e com excelente caimento. Uma peça para usar em várias ocasiões.',
      sizes: ['p', 'm', 'g']
    },
    {
      name: 'Blusa Estampada MX Fashion',
      slug: 'blusa-estampada-mx-fashion',
      category: 'Blusas',
      image: '/images/BLUSAESTAMPADAMX.jpg',
      price: 159.90,
      brand: 'MX',
      rating: 4.8,
      numReviews: 67,
      countInStock: 20,
      description: 'Blusa da marca MX. Confeccionada em crepe. Toque super leve, macio e com ótimo caimento.',
      sizes: ['p', 'm', 'g']
    },
    {
      name: 'Blusa Viscolycra Declari Preto',
      slug: 'Blusa-Viscolycra-Declari-Preto',
      category: 'Blusas',
      image: '/images/Blusa-Viscolycra-Declari-Preto.jpg',
      price: 153.90,
      brand: 'Declari',
      rating: 4.5,
      numReviews: 945,
      countInStock: 20,
      description: ' Blusa em malha fria de poliéster com elastano. Decote frente canoa, costas em V com recorte em tira. Ombros com franzido.',
      sizes: ['p', 'm', 'g']
      
    },
    {
      name: 'Blusa Viscolycra Declari Rosa',
      category: 'Blusas',
      slug: 'blusa-viscolycra-declari-rosa',
      image: '/images/BLUSA-VISCOLYCRA-DECLARI-ROSA.jpg',
      price: 126.90,
      brand: 'Declari',
      rating: 4.5,
      numReviews: 15,
      countInStock: 20,
      description: 'Blusa da marca Declari. Confeccionado em viscolycra. Toque macio, com elasticidade e excelente caimento. Perfeito para compor diversos looks!',
      sizes: ['p', 'm', 'g']
    },
    {
      name: 'Conjunto Linho Gatos E Atos Rosa',
      slug: 'conjunto-linho-gatos-e-atos-rosa',
      category: 'Macacão',
      image: '/images/Conjunto-Linho-Gatos-E-Atos-Rosa.jpg',
      price: 426.90,
      brand: 'Gatos e Atos',
      rating: 3,
      numReviews: 8,
      countInStock: 20,
      description: 'Conjunto da marca Gatos e Atos. Confeccionado em linho. Perfeito para uma ocasição mais casual',
      sizes: ['p', 'm', 'g']
    },
  ]
  
}

export default data
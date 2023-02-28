import BurguerKing from '../assets/images/burger-king.png';
import MacDonalds from '../assets/images/macdonalds.png';
import Hamburguesa from '../assets/images/burger2.jpg';
import Harina from '../assets/images/harina.jpg';
import Refresco from '../assets/images/refresco.jpeg';

export const UserCarts = [
  {
    id: 1,
    store: {
      name: 'BurguerKing',
      image: BurguerKing,
      slug: 'burguerking'
    },
    client: {
      id: 2,
      name: 'Jesus Vicuña',
      address: {
        address: 'C.A.B.A.'
      },
      profileImg: 'imagen'
    },
    currency: {
      symbol: '$',
      code: 'ARS',
      name: 'Peso Argentino'
    },
    products: [
      {
        name: 'Hamburguesa',
        price: 15,
        currency: {
          symbol: '$',
          code: 'ARS',
          name: 'Peso Argentino'
        },
        quantity: 12,
        image: Hamburguesa
      },
      {
        name: 'Hamburguesa',
        price: 15,
        currency: {
          symbol: '$',
          code: 'ARS',
          name: 'Peso Argentino'
        },
        quantity: 12,
        image: Hamburguesa
      },
      {
        name: 'Harina',
        price: 35,
        currency: {
          symbol: '$',
          code: 'ARS',
          name: 'Peso Argentino'
        },
        quantity: 4,
        image: Harina
      },
      {
        name: 'Refresco de 1.5lt',
        price: 10,
        currency: {
          symbol: '$',
          code: 'ARS',
          name: 'Peso Argentino'
        },
        quantity: 1,
        image: Refresco
      }
    ],
    createdAt: new Date()
  },
  {
    id: 2,
    store: {
      name: 'Macdonalds',
      image: MacDonalds,
      slug: 'mac-donalds'
    },
    client: {
      id: 1,
      name: 'Jeyver Vegas',
      address: {
        address: 'C.A.B.A.'
      },
      profileImg: 'imagen'
    },
    products: [
      {
        name: 'Hamburguesa 3 quesos',
        price: 15,
        currency: {
          symbol: '$',
          code: 'ARS',
          name: 'Peso Argentino'
        },
        quantity: 3,
        image: Hamburguesa
      },
      {
        name: 'Hamburguesa doble carne.',
        price: 8,
        currency: {
          symbol: '$',
          code: 'ARS',
          name: 'Peso Argentino'
        },
        quantity: 4,
        image: Hamburguesa
      },
      {
        name: 'Refresco de 1.5lt',
        price: 3.58,
        currency: {
          symbol: '$',
          code: 'ARS',
          name: 'Peso Argentino'
        },
        quantity: 1,
        image: Refresco
      }
    ],
    currency: {
      symbol: '$',
      code: 'ARS',
      name: 'Peso Argentino'
    },
    createdAt: new Date()
  }
];
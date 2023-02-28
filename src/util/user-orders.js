export const UserOrders = [
  {
    ref: 'SJNVELAC46',
    store: {
      name: 'BurguerKing',
      img: 'imagen',
      slug: 'burguer-king'
    },
    client: {
      id: 1,
      name: 'Jeyver Vegas',
      address: {
        address: 'C.A.B.A.'
      },
      profileImg: 'imagen'
    },
    total: 15,
    currency: {
      symbol: '$',
      code: 'ARS',
      name: 'Peso Argentino'
    },
    createdAt: new Date(),
    statutes: [
      {
        name: 'Finalizada.',
        color: '#2563EB',
        asignedAt: new Date()
      },
      {
        name: 'Pago Aceptado',
        color: '#B91C1C',
        asignedAt: new Date()
      },
      {
        name: 'En proceso de pago.',
        color: '#ffc107',
        asignedAt: new Date()
      },
      {
        name: 'En proceso de envio.',
        color: '#7C3AED',
        asignedAt: new Date()
      },
    ],
    paidMethod: {
      name: 'MercadoPago'
    }
  },
  {
    ref: 'DKFKVNSX21',
    store: {
      name: 'Mac Donalds',
      img: 'imagen',
      slug: 'mac-donalds'
    },
    client: {
      name: 'Jeyver Vegas',
      address: {
        address: 'C.A.B.A.'
      },
      profileImg: 'imagen'
    },
    total: 12345,
    currency: {
      symbol: '$',
      code: 'ARS',
      name: 'Peso Argentino'
    },
    createdAt: new Date(),
    statutes: [
      {
        name: 'En proceso de envio.',
        color: '#7C3AED',
        asignedAt: new Date()
      },
      {
        name: 'En proceso de pago.',
        color: '#ffc107',
        asignedAt: new Date()
      },
      {
        name: 'Pago Aceptado',
        color: '#ffc107',
        asignedAt: new Date()
      },
    ],
    paidMethod: {
      name: 'MercadoPago'
    }
  },

  {
    ref: 'OSNDVSN3567',
    store: {
      name: 'Mac Donalds',
      img: 'imagen',
      slug: 'mac-donalds'
    },
    client: {
      name: 'Jeyver Vegas',
      address: {
        address: 'C.A.B.A.'
      },
      profileImg: 'imagen'
    },
    total: 15,
    currency: {
      symbol: '$',
      code: 'ARS',
      name: 'Peso Argentino'
    },
    createdAt: new Date(),
    statutes: [
      {
        name: 'Pago Aceptado',
        color: '#B91C1C',
        asignedAt: new Date()
      },
      {
        name: 'En proceso de pago.',
        color: '#ffc107',
        asignedAt: new Date()
      },
      {
        name: 'En proceso de envio.',
        color: '#7C3AED',
        asignedAt: new Date()
      },
      {
        name: 'Enviado.',
        color: '#6D28D9',
        asignedAt: new Date()
      },
      {
        name: 'Recibido.',
        color: '#059669',
        asignedAt: new Date()
      },
      {
        name: 'Finalizada.',
        color: '#2563EB',
        asignedAt: new Date()
      },
    ],
    paidMethod: {
      name: 'MercadoPago'
    }
  }


]
const after3Days = new Date(new Date().setHours(24 * 3.1));
const started = new Date(new Date().getTime() - 1000);
const under24H = new Date(new Date().getTime() + 46958000);

export const marketplaceList = [
  {
    id: 1,
    imageUrl: '/img/temp/card_image_1.png',
    name: '#01_Dooropen',
    seller: 'Dooropen',
    storeId: 1,
    price: 0.0002,
    startAt: after3Days,
    endAt: after3Days,
    bookmark: 21,
    unit: 'ETH',
    bundle: true
  },
  {
    id: 2,
    imageUrl: '/img/temp/card_image_2.png',
    name: '#01_Dooropen',
    seller: 'Dooropen',
    storeId: 1,
    price: 0.0002,
    startAt: started,
    endAt: after3Days,
    bookmark: 0,
    unit: 'ETH',
  },
  {
    id: 3,
    imageUrl: '/img/temp/card_image_3.png',
    name: '#01_Dooropen',
    seller: 'Dooropen',
    storeId: 1,
    price: 0.0002,
    startAt: started,
    endAt: under24H,
    bookmark: 0,
    unit: 'ETH'
  },
  {
    id: 4,
    imageUrl: '/img/temp/card_image_4.png',
    name: '#01_Dooropen',
    seller: 'Dooropen',
    storeId: 1,
    price: 0.0002,
    startAt: started,
    endAt: started,
    bookmark: 0,
    unit: 'ETH'
  },
  {
    id: 5,
    imageUrl: '/img/temp/card_image_1.png',
    name: '#01_Dooropen',
    seller: 'Dooropen',
    storeId: 1,
    price: 0.0002,
    startAt: after3Days,
    endAt: after3Days,
    bookmark: 21,
    unit: 'ETH',
    bundle: true
  },
  {
    id: 6,
    imageUrl: '/img/temp/card_image_2.png',
    name: '#01_Dooropen',
    seller: 'Dooropen',
    storeId: 1,
    price: 0.0002,
    startAt: started,
    endAt: after3Days,
    bookmark: 0,
    unit: 'ETH'
  },
  {
    id: 7,
    imageUrl: '/img/temp/card_image_3.png',
    name: '#01_Dooropen',
    seller: 'Dooropen',
    storeId: 1,
    price: 0.0002,
    startAt: started,
    endAt: under24H,
    bookmark: 0,
    unit: 'ETH'
  },
  {
    id: 8,
    imageUrl: '/img/temp/card_image_4.png',
    name: '#01_Dooropen',
    seller: 'Dooropen',
    storeId: 1,
    price: 0.0002,
    startAt: started,
    endAt: started,
    bookmark: 0,
    unit: 'ETH'
  },
  {
    id: 9,
    imageUrl: '/img/temp/card_image_1.png',
    name: '#01_Dooropen',
    seller: 'Dooropen',
    storeId: 1,
    price: 0.0002,
    startAt: after3Days,
    endAt: after3Days,
    bookmark: 21,
    unit: 'ETH',
    bundle: true
  },
  {
    id: 10,
    imageUrl: '/img/temp/card_image_2.png',
    name: '#01_Dooropen',
    seller: 'Dooropen',
    storeId: 1,
    price: 0.0002,
    startAt: started,
    endAt: after3Days,
    bookmark: 0,
    unit: 'ETH'
  },
  {
    id: 11,
    imageUrl: '/img/temp/card_image_3.png',
    name: '#01_Dooropen',
    seller: 'Dooropen',
    storeId: 1,
    price: 0.0002,
    startAt: started,
    endAt: under24H,
    bookmark: 0,
    unit: 'ETH'
  },
  {
    id: 12,
    imageUrl: '/img/temp/card_image_4.png',
    name: '#01_Dooropen',
    seller: 'Dooropen',
    storeId: 1,
    price: 0.0002,
    startAt: started,
    endAt: started,
    bookmark: 0,
    unit: 'ETH'
  },
  {
    id: 13,
    imageUrl: '/img/temp/card_image_1.png',
    name: '#01_Dooropen',
    seller: 'Dooropen',
    storeId: 1,
    price: 0.0002,
    startAt: after3Days,
    endAt: after3Days,
    bookmark: 21,
    unit: 'ETH',
    bundle: true
  },
  {
    id: 14,
    imageUrl: '/img/temp/card_image_2.png',
    name: '#01_Dooropen',
    seller: 'Dooropen',
    storeId: 1,
    price: 0.0002,
    startAt: started,
    endAt: after3Days,
    bookmark: 0,
    unit: 'ETH'
  },
  {
    id: 15,
    imageUrl: '/img/temp/card_image_3.png',
    name: '#01_Dooropen',
    seller: 'Dooropen',
    storeId: 1,
    price: 0.0002,
    startAt: started,
    endAt: under24H,
    bookmark: 0,
    unit: 'ETH'
  },
  {
    id: 16,
    imageUrl: '/img/temp/card_image_4.png',
    name: '#01_Dooropen',
    seller: 'Dooropen',
    storeId: 1,
    price: 0.0002,
    startAt: started,
    endAt: started,
    bookmark: 0,
    unit: 'ETH'
  },
  {
    id: 17,
    imageUrl: '/img/temp/card_image_1.png',
    name: '#01_Dooropen',
    seller: 'Dooropen',
    storeId: 1,
    price: 0.0002,
    startAt: after3Days,
    endAt: after3Days,
    bookmark: 21,
    unit: 'ETH',
    bundle: true
  },
  {
    id: 18,
    imageUrl: '/img/temp/card_image_2.png',
    name: '#01_Dooropen',
    seller: 'Dooropen',
    storeId: 1,
    price: 0.0002,
    startAt: started,
    endAt: after3Days,
    bookmark: 0,
    unit: 'ETH'
  }
];

export const chartData = [];
for (let i = 50; i > 0; i--) {
  const date = new Date(Date.now() - i * 1000 * 60);
  chartData.push({x: date, y: Math.random() * 10})
}



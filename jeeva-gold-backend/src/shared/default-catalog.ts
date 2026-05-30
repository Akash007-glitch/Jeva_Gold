export type DefaultCatalogItem = {
  product_id: string;
  name: string;
  size: string;
  price: number;
  description: string;
  origin: string;
  tags: string[];
  featured: boolean;
  stock: number;
};

export const defaultCatalog: DefaultCatalogItem[] = [
  {
    product_id: 'starter-1',
    name: 'Jeeva Gold Elaichi',
    size: '250g x 2 Pack',
    price: 280,
    description: 'Jeeva Gold Elaichi Tea brings rich strength and soothing aroma of cardamom for a perfect tea experience.',
    origin: 'Elaichi',
    tags: ['Elaichi', '250g Pack of 2'],
    featured: false,
    stock: 99,
  },
  {
    product_id: 'starter-2',
    name: 'Jeeva Gold Premium Tea',
    size: '250g x 2 Pack',
    price: 210,
    description: 'Jeeva Gold brings the richness of Strong Assam Tea into every sip - bold in taste, rich in colour, and full of life.',
    origin: 'Premium Assam',
    tags: ['250g x 2 Pack', 'Premium Assam'],
    featured: true,
    stock: 99,
  },
  {
    product_id: 'starter-3',
    name: 'Jeeva Gold Masala Chai',
    size: '250g x 2 Pack',
    price: 300,
    description: 'Jeeva Gold Masala Chai is a rich fusion of premium tea and aromatic spices, crafted for a strong and flavorful cup.',
    origin: 'Masala',
    tags: ['250g x 2 Pack', 'Masala'],
    featured: false,
    stock: 99,
  },
  {
    product_id: 'starter-4',
    name: 'Jeeva Gold Green',
    size: '100g x 2 Pack',
    price: 280,
    description: 'Jeeva Gold Wellness Green Tea delivers a crisp burst of antioxidants and revitalizing freshness.',
    origin: 'Green Tea',
    tags: ['Green Tea', 'Wellness'],
    featured: false,
    stock: 99,
  },
  {
    product_id: 'starter-5',
    name: 'Jeeva Gold Premium Tea',
    size: '1 KG Pack',
    price: 360,
    description: 'Jeeva Gold brings the richness of Strong Assam Tea into every sip - bold in taste, rich in colour, and full of life.',
    origin: 'Premium Assam',
    tags: ['1KG', 'Premium Assam'],
    featured: false,
    stock: 99,
  },
  {
    product_id: 'starter-6',
    name: 'Jeeva Gold Royal Tea',
    size: '1 KG Pack',
    price: 450,
    description: 'Jeeva Gold Royal Tea brings a sophisticated and elegant tea experience with its premium blend and rich aroma.',
    origin: 'Premium Assam',
    tags: ['1KG', 'Premium Assam'],
    featured: false,
    stock: 99,
  },
];

export const getDefaultCatalogKey = (item: Pick<DefaultCatalogItem, 'name' | 'size'>) =>
  `${item.name.trim().toLowerCase()}::${item.size.trim().toLowerCase()}`;

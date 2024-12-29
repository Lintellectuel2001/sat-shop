import { Product } from './types/product';
import { iptvProducts } from './products/iptv';
import { sharingProducts } from './products/sharing';
import { vodProducts } from './products/vod';

export type { Product } from './types/product';

export const products: Product[] = [
  ...iptvProducts,
  ...sharingProducts,
  ...vodProducts
];
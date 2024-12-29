export interface Product {
  id: number;
  name: string;
  price: string;
  rating: number;
  reviews: number;
  image: string;
  paymentLink: string;
  paypalLink?: string;
  category: "iptv" | "sharing" | "vod";
  description?: string;
  features?: string[];
  downloadInfo?: {
    ironTvPro?: {
      directLinks: string[];
      downloaderCodes: string[];
    };
    ironTvMax?: {
      directLinks: string[];
      downloaderCodes: string[];
    };
    noxPro?: {
      directLink: string;
      downloaderCode: string;
    };
    atlasPro?: {
      directLink: string;
      downloaderCode: string;
    };
  };
}
export interface Bakery {
  id: string;
  place_name: string;
  category_name: string;
  road_address_name: string;
  address_name: string;
  phone: string;
  place_url: string;
}

export interface BakeriesResponse {
  bakeries: Bakery[];
}

export interface ErrorResponse {
  message: string;
}

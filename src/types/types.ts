export type ThemeData = {
  borderRadius: number;
  colorPrimary: string;
};

export interface Property {
  [key: string]: any;
  cladding_cert: boolean;
  contacted_agent: boolean;
  created_at: string | null;
  electrics_cert: boolean;
  energy_effeciency: number;
  est_month_rent: number;
  floor_level: number;
  garden_balcony: boolean;
  house_price: number;
  id: number;
  interior: number;
  lease_length: number;
  local_gym: boolean;
  local_supermarket: boolean;
  sc_gr_annual: number;
  sq_metres: number;
  url_link: string;
  view: number;
}

export type CreateProperty = Omit<Property, "id" | "created_at">;

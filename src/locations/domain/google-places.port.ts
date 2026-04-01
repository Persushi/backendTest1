export interface PlaceDetails {
  address: string;
  latitude: number;
  longitude: number;
}

export interface GooglePlacesPort {
  getPlaceDetails(place_id: string): Promise<PlaceDetails>;
}

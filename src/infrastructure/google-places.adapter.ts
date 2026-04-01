import { Injectable, BadGatewayException } from '@nestjs/common';
import type { GooglePlacesPort, PlaceDetails } from '../domain/google-places.port';

interface GooglePlacesResponse {
  formattedAddress?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  error?: {
    message: string;
  };
}

@Injectable()
export class GooglePlacesAdapter implements GooglePlacesPort {
  private readonly apiKey = process.env.GOOGLE_PLACES_API_KEY ?? '';
  private readonly baseUrl = 'https://places.googleapis.com/v1/places';

  async getPlaceDetails(place_id: string): Promise<PlaceDetails> {
    const url = `${this.baseUrl}/${place_id}?fields=formattedAddress,location&key=${this.apiKey}`;

    let response: Response;
    try {
      response = await fetch(url);
    } catch {
      throw new BadGatewayException('Could not reach Google Places API');
    }

    const data: GooglePlacesResponse = await response.json() as GooglePlacesResponse;

    if (!response.ok || data.error) {
      throw new BadGatewayException(
        data.error?.message ?? 'Invalid response from Google Places API',
      );
    }

    if (!data.formattedAddress || !data.location) {
      throw new BadGatewayException('Google Places API returned incomplete data for this place');
    }

    return {
      address: data.formattedAddress,
      latitude: data.location.latitude,
      longitude: data.location.longitude,
    };
  }
}

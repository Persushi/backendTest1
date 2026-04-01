import type { Location } from './location.entity';

export interface CreateLocationData {
  place_id: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface UpdateLocationData {
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface LocationRepositoryPort {
  create(data: CreateLocationData): Promise<Location>;
  findAll(): Promise<Location[]>;
  findById(id: string): Promise<Location | null>;
  findByPlaceId(place_id: string): Promise<Location | null>;
  update(id: string, data: UpdateLocationData): Promise<Location | null>;
  delete(id: string): Promise<boolean>;
}

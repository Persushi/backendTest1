import type { Truck, TruckWithUser } from './truck.entity';

export interface CreateTruckData {
  userId: string;
  year: string;
  color: string;
  plates: string;
}

export interface UpdateTruckData {
  year?: string;
  color?: string;
  plates?: string;
}

export interface TruckRepositoryPort {
  create(data: CreateTruckData): Promise<Truck>;
  findAllWithUser(): Promise<TruckWithUser[]>;
  findById(id: string): Promise<Truck | null>;
  update(id: string, userId: string, data: UpdateTruckData): Promise<Truck | null>;
  delete(id: string, userId: string): Promise<boolean>;
}

import { OrderStatus } from './order-status.enum';
import type { Order, OrderWithRefs } from './order.entity';

export interface CreateOrderData {
  userId: string;
  truckId: string;
  pickupId: string;
  dropoffId: string;
}

export interface UpdateOrderData {
  truckId?: string;
  pickupId?: string;
  dropoffId?: string;
}

export interface OrderRepositoryPort {
  create(data: CreateOrderData): Promise<Order>;
  findAllWithRefs(): Promise<OrderWithRefs[]>;
  findById(id: string): Promise<Order | null>;
  updateFields(id: string, data: UpdateOrderData): Promise<Order | null>;
  updateStatus(id: string, status: OrderStatus): Promise<Order | null>;
  delete(id: string): Promise<boolean>;
}

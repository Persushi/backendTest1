import { OrderStatus } from './order-status.enum';

export class Order {
  constructor(
    public readonly _id: string,
    public readonly userId: string,
    public readonly truckId: string,
    public readonly status: OrderStatus,
    public readonly pickupId: string,
    public readonly dropoffId: string,
  ) {}
}

export class OrderUser {
  constructor(
    public readonly _id: string,
    public readonly email: string,
  ) {}
}

export class OrderTruck {
  constructor(
    public readonly _id: string,
    public readonly year: string,
    public readonly color: string,
    public readonly plates: string,
  ) {}
}

export class OrderLocation {
  constructor(
    public readonly _id: string,
    public readonly place_id: string,
    public readonly address: string,
    public readonly latitude: number,
    public readonly longitude: number,
  ) {}
}

export class OrderWithRefs {
  constructor(
    public readonly _id: string,
    public readonly user: OrderUser,
    public readonly truck: OrderTruck,
    public readonly status: OrderStatus,
    public readonly pickup: OrderLocation,
    public readonly dropoff: OrderLocation,
  ) {}
}

export class TruckUser {
  constructor(
    public readonly _id: string,
    public readonly email: string,
  ) {}
}

export class Truck {
  constructor(
    public readonly _id: string,
    public readonly userId: string,
    public readonly year: string,
    public readonly color: string,
    public readonly plates: string,
  ) {}
}

export class TruckWithUser {
  constructor(
    public readonly _id: string,
    public readonly user: TruckUser,
    public readonly year: string,
    public readonly color: string,
    public readonly plates: string,
  ) {}
}

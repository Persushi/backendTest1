export class Location {
  constructor(
    public readonly _id: string,
    public readonly place_id: string,
    public readonly address: string,
    public readonly latitude: number,
    public readonly longitude: number,
  ) {}
}

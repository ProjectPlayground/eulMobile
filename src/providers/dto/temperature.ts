/**
 * Created by tymons on 14.01.17.
 */
export class Temperature{

  constructor(
    public id : number,
    public valueOutdoor : number,
    public valueIndoor : number,
    public measuredTimestamp : number,
    public hive_id : number
  ) {}
}
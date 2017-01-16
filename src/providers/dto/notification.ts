/**
 * Created by tymons on 15.01.17.
 */
export class notification {
  constructor(
    public webNotification : boolean,
    public smsNotification : boolean,
    public weightThreshold : number,
    public deviceId : string,
    public userId? : string,
    public id? : number) {}
}

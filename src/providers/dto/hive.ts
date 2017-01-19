import {AccessPoint} from "./AccessPoint";
/**
 * Created by tymons on 18.01.17.
 */
export class hive{

  constructor(
    public name: string,
    public location: string,
    public active: boolean,
    public sn: string,

    public ownerId?: number,
    public th1Status?: boolean,
    public th2Status?: boolean,
    public th3Status?: boolean,
    public mic1Status?: boolean,
    public mic2Status?: boolean,
    public mic3Status?: boolean,
    public mic4Status?: boolean,
    public solarStatus?: boolean,
    public rainStatus?: boolean,
    public weightStatus?: boolean,
    public thIntervalSec?: number,
    public micIntervalSec?: number,
    public solarIntervalSec?: number,
    public rainIntervalSec?: number,
    public weightIntervalSec?: number,
    public internalCommIntervalSec?: number,

    public id?: number,
    public accessPoint?: AccessPoint
  ) {}
}

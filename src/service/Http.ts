import * as _ from 'lodash';
import Axios, {AxiosResponse} from 'axios';

export class Http {
  public static async request(options: any = {}): Promise<AxiosResponse> {
    const config: any = {
      method: 'GET',
    };

    _.assign(config, options);

    try {
      return await Axios.request(config);
    } catch (e: any) {
      // console.log(e.response.data);

      throw e;
    }
  }
}

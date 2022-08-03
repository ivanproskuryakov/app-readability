import * as _ from 'lodash';
import Axios, {AxiosResponse} from 'axios';
import {injectable} from 'inversify';

@injectable()
export class Http {
  public async request(options: any = {}): Promise<AxiosResponse> {
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

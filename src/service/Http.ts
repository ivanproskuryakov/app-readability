import * as _ from 'lodash';
import Axios, {AxiosResponse} from 'axios';
import {inject, injectable} from 'inversify';

import {ExecutionInterceptor} from "./ExecutionInterceptor";

@injectable()
export class Http {
  @inject('ExecutionInterceptor')
  protected executionInterceptor: ExecutionInterceptor;

  public async requestGet(url: string) {
    const response = await this.request({
      url
    });

    return response.data;
  }

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

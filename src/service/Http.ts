import Axios, {AxiosResponse} from 'axios';
import {injectable} from 'inversify';

@injectable()
export class Http {

  public async request(url: string, timeout: number): Promise<AxiosResponse> {
    const config: any = {
      url: url,
      method: 'GET',
      timeout: timeout,
    };

    try {
      return await Axios.request(config);
    } catch (e: any) {
      // console.log(e.response.data);

      throw e;
    }
  }
}

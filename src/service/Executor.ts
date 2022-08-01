import {inject, injectable} from "inversify";

import {Http} from "./Http";

@injectable()
export class Executor {
  @inject('Http')
  protected http: Http;

  public runInParallel(urls: string[], concurrency: number): Promise<string[]> {
    const res: string[] = [];

    console.log(urls);
    console.log(concurrency);

    return Promise.resolve(res);
  }
}

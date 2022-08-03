import {inject, injectable} from 'inversify';
import {Readability} from '@mozilla/readability';
import * as _ from 'lodash';
import {JSDOM} from 'jsdom';

import {Http} from './Http';
import {IText} from "../interface/IText";

@injectable()
export class Executor {
  public static ERROR_NO_CONTENT = 'ERROR_NO_CONTENT';
  public static TIMEOUT_MS = 200;

  @inject('Http')
  protected http: Http;

  public async runInParallel(urls: string[], concurrency: number): Promise<IText[][]> {
    const chunks = _.chunk(urls, concurrency);
    const texts = [];

    for (let i = 0; i < chunks.length; i++) {
      const urls = chunks[i]
      const promises = [];

      for (let j = 0; j < urls.length; j++) {
        promises.push(this.read(urls[j]))
      }

      texts.push(await Promise.all(promises));
    }

    return texts;
  }

  private async read(url: string): Promise<IText> {
    let error = '';
    let text = ''

    try {
      const response = await this.http.request({
        url,
        timeout: Executor.TIMEOUT_MS
      });
      const doc = new JSDOM(response.data, {
        url
      });

      const reader = new Readability(doc.window.document);
      const article = reader.parse();

      if (article && article.textContent) {
        text = article.textContent;
      } else {
        error = Executor.ERROR_NO_CONTENT;
      }
    } catch (e: any) {
      error = e.message;
    }

    return Promise.resolve({
      url,
      text,
      error,
    });
  }
}

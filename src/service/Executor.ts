import {inject, injectable} from 'inversify';
import {Readability} from '@mozilla/readability';
import * as _ from 'lodash';
import {JSDOM} from 'jsdom';

import {Http} from './Http';

@injectable()
export class Executor {
  @inject('Http')
  protected http: Http;

  public async runInParallel(urls: string[], concurrency: number): Promise<string[]> {
    const chunks = _.chunk(urls, concurrency);
    let texts: string[] = [];

    for (let i = 0; i < chunks.length; i++) {
      const urls = chunks[i]
      const promises = [];

      for (let j = 0; j < urls.length; j++) {
        promises.push(this.read(urls[j]))
      }

      texts = [
        ...texts,
        ...await Promise.all(promises),
      ]
    }

    return texts;
  }

  private async read(url: string): Promise<string> {
    const html = await this.http.requestGet(url);
    const doc = new JSDOM(html, {
      url
    });

    const reader = new Readability(doc.window.document);
    const article = reader.parse();
    let text = ''

    if (article && article.textContent) {
      text = article.textContent;
    }

    return Promise.resolve(text);
  }
}

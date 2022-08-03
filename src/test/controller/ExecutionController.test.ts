import fs from 'fs';
import {join} from 'path';
import nock from 'nock';
import {expect} from 'chai';

import {suite, test} from '@testdeck/mocha';
import {Http} from '../../service/Http';
import {BaseControllerTest} from './BaseController.test';

@suite
export class ExecutionControllerTest extends BaseControllerTest {
  protected http: Http;
  protected wiki: string = 'https://en.wikipedia.org';

  constructor() {
    super();

    this.http = this.container.get('Http');
  }

  @test
  async runInParallel() {
    const data = {
      Mount_Elbrus: fs.readFileSync(join(__dirname, '../fixture/wiki/Mount_Elbrus')),
    };

    nock(this.wiki).get('/wiki/Mount_Elbrus').once().reply(200, data.Mount_Elbrus);

    const config = {
      url: `${this.url}/api/execution/runInParallel`,
      method: 'POST',
      data: {
        urls: ['https://en.wikipedia.org/wiki/Mount_Elbrus'],
        concurrency: 1,
      },
    };
    const response = await this.http.request(config);

    expect(response.data.length).to.be.equal(1);
    expect(response.data[0].length).to.be.equal(1);
    expect(response.data[0][0].url).to.be.equal('https://en.wikipedia.org/wiki/Mount_Elbrus');

    expect(response.status).to.be.equal(200);
  }
}

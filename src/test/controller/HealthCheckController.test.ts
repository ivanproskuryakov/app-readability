import {expect} from 'chai';
import {suite, test} from '@testdeck/mocha';
import {Http} from '../../service/Http';
import {BaseControllerTest} from './BaseController.test';

@suite
export class HealthCheckControllerTest extends BaseControllerTest {
  constructor() {
    super();
  }

  @test
  async healthCheck() {
    const config = {
      url: `${this.url}/api/healthcheck`,
      method: 'GET',
    };
    const resp = await Http.request(config);
    expect(resp.status).to.be.equal(200);
    expect(Object.keys(resp.data).length).to.be.equals(0);
  }
}

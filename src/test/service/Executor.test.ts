import {suite, test} from '@testdeck/mocha';
import nock from 'nock';
import {join} from 'path';
import fs from 'fs';

import {Executor} from '../../service/Executor';
import {AppConfig} from '../../app/AppConfig';
import {AppContainer} from '../../app/AppContainer';
import {expect} from 'chai';

@suite()
export class ExecutorTest {
  protected wiki: string = 'https://en.wikipedia.org';
  protected executor: Executor;

  constructor() {
    const env = AppConfig.getEnv();
    const parameters = AppConfig.readLocal();
    const container = AppContainer.build(parameters, env);

    this.executor = container.get('Executor');
  }

  before() {
    const data = {
      Mount_Elbrus: fs.readFileSync(join(__dirname, '../fixture/wiki/Mount_Elbrus')),
      Mount_Everest: fs.readFileSync(join(__dirname, '../fixture/wiki/Mount_Everest')),
      Mount_Fuji: fs.readFileSync(join(__dirname, '../fixture/wiki/Mount_Fuji')),
      Mount_Kenya: fs.readFileSync(join(__dirname, '../fixture/wiki/Mount_Kenya')),
      Mount_Kilimanjaro: fs.readFileSync(join(__dirname, '../fixture/wiki/Mount_Kilimanjaro')),
      Puncak_Jaya: fs.readFileSync(join(__dirname, '../fixture/wiki/Puncak_Jaya')),
    };

    nock(this.wiki).get('/wiki/Mount_Elbrus').once().reply(200, data.Mount_Elbrus);
    nock(this.wiki).get('/wiki/Mount_Everest').once().reply(200, data.Mount_Everest);
    nock(this.wiki).get('/wiki/Mount_Fuji').once().reply(200, data.Mount_Fuji);
    nock(this.wiki).get('/wiki/Mount_Kenya').once().reply(200, data.Mount_Kenya);
    nock(this.wiki).get('/wiki/Mount_Kilimanjaro').once().reply(200, data.Mount_Kilimanjaro);
    nock(this.wiki).get('/wiki/Puncak_Jaya').once().reply(200, data.Puncak_Jaya);

    nock(this.wiki).get('/timeout2000').once().delayConnection(2000).reply(200);
    nock(this.wiki).get('/error404').once().reply(404, '404');
  }

  @test()
  async runInParallel_concurrency16() {
    const urls = [
      'https://en.wikipedia.org/wiki/Mount_Elbrus',
      'https://en.wikipedia.org/wiki/Mount_Everest',
      'https://en.wikipedia.org/wiki/Mount_Fuji',
    ];

    const texts = await this.executor.runInParallel(urls, 6);

    expect(texts.length).to.be.eq(1);
  }

  @test()
  async runInParallel_concurrency23() {
    const urls = [
      'https://en.wikipedia.org/wiki/Mount_Elbrus',
      'https://en.wikipedia.org/wiki/Mount_Everest',
      'https://en.wikipedia.org/wiki/Mount_Fuji',
    ];

    const texts = await this.executor.runInParallel(urls, 2);

    expect(texts.length).to.be.eq(2);
    expect(texts[0].length).to.be.eq(2);
    expect(texts[1].length).to.be.eq(1);
  }

  @test()
  async runInParallel_concurrency61() {
    const urls = [
      'https://en.wikipedia.org/wiki/Mount_Elbrus',
      'https://en.wikipedia.org/wiki/Mount_Everest',
      'https://en.wikipedia.org/wiki/Mount_Fuji',
      'https://en.wikipedia.org/wiki/Mount_Kenya',
      'https://en.wikipedia.org/wiki/Mount_Kilimanjaro',
      'https://en.wikipedia.org/wiki/Puncak_Jaya',
    ];

    const texts = await this.executor.runInParallel(urls, 1);

    expect(texts.length).to.be.eq(6);
  }

  @test()
  async runInParallel_timeout2000() {
    const urls = [
      'https://en.wikipedia.org/wiki/Mount_Elbrus',
      'https://en.wikipedia.org/timeout2000',
    ];

    const texts = await this.executor.runInParallel(urls, 2);

    expect(texts.length).to.be.eq(1);
    expect(texts[0][1]).to.be.deep.eq({
      url: 'https://en.wikipedia.org/timeout2000',
      text: '',
      error: 'timeout of 200ms exceeded',
    });
  }

  @test()
  async runInParallel_error404() {
    const urls = [
      'https://en.wikipedia.org/wiki/Mount_Elbrus',
      'https://en.wikipedia.org/error404',
    ];

    const texts = await this.executor.runInParallel(urls, 2);

    expect(texts.length).to.be.eq(1);
    expect(texts[0][1]).to.be.deep.eq({
      url: 'https://en.wikipedia.org/error404',
      text: '',
      error: 'Request failed with status code 404',
    });
  }
}

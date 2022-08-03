import {suite, test, timeout} from '@testdeck/mocha';
import nock from 'nock';
import {join} from "path";
import fs from "fs";

import {Executor} from '../../service/Executor';
import {AppConfig} from "../../app/AppConfig";
import {AppContainer} from "../../app/AppContainer";

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
    }

    nock(this.wiki).get('/wiki/Mount_Elbrus').once().reply(200, data.Mount_Elbrus);
    nock(this.wiki).get('/wiki/Mount_Everest').once().reply(200, data.Mount_Everest);
    nock(this.wiki).get('/wiki/Mount_Fuji').once().reply(200, data.Mount_Fuji);
    nock(this.wiki).get('/wiki/Mount_Kenya').once().reply(200, data.Mount_Kenya);
    nock(this.wiki).get('/wiki/Mount_Kilimanjaro').once().reply(200, data.Mount_Kilimanjaro);
    nock(this.wiki).get('/wiki/Puncak_Jaya').once().reply(200, data.Puncak_Jaya);
  }

  @test()
  @timeout(10000)
  async runInParallel() {
    const urls = [
      'https://en.wikipedia.org/wiki/Mount_Elbrus',
      'https://en.wikipedia.org/wiki/Mount_Everest',
      'https://en.wikipedia.org/wiki/Mount_Fuji',
      'https://en.wikipedia.org/wiki/Mount_Kenya',
      'https://en.wikipedia.org/wiki/Mount_Kilimanjaro',
      'https://en.wikipedia.org/wiki/Puncak_Jaya',
    ];

    const texts = await this.executor.runInParallel(urls, 1);

    // console.log(texts);
    console.log(texts.length);
  }
}

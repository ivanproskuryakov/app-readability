import {Post, Body, HttpCode, JsonController} from 'routing-controllers';

import {App} from '../app/App';
import {Executor} from '../service/Executor';

@JsonController('/executor')
export class ExecutionController {
  protected executor: Executor;

  constructor() {
    this.executor = App.container.get('Executor');
  }

  @Post('/runInParallel')
  @HttpCode(200)
  public async run(@Body() payload: any) {
    return this.executor.runInParallel(payload.urls, payload.concurrency);
  }
}

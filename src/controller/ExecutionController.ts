import {Post, Body, HttpCode, JsonController} from 'routing-controllers';
import {OpenAPI} from 'routing-controllers-openapi';

import {App} from '../app/App';
import {Executor} from '../service/Executor';
import {IText} from '../interface/IText';

@JsonController('/execution')
export class ExecutionController {
  protected executor: Executor;

  constructor() {
    this.executor = App.container.get('Executor');
  }

  @Post('/runInParallel')
  @HttpCode(200)
  @OpenAPI({
    requestBody: {
      content: {
        'application/json': {
          example: {
            urls: [
              'https://en.wikipedia.org/wiki/Mount_Elbrus',
              'https://en.wikipedia.org/wiki/Mount_Everest',
              'https://en.wikipedia.org/wiki/Puncak_Jaya',
            ],
            concurrency: 10,
          },
        },
      },
      required: false,
    },
  })
  public runInParallel(@Body() payload: any): Promise<IText[][]> {
    return this.executor.runInParallel(payload.urls, payload.concurrency);
  }
}

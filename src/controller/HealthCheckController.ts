import {Get, HttpCode, JsonController} from 'routing-controllers';

@JsonController('/healthcheck')
export class HealthCheckController {
  @Get('/')
  @HttpCode(200)
  public async healthCheck() {
    return {};
  }
}

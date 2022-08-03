import {Container} from 'inversify';

import {IConfigParameters} from '../interface/IConfigParameters';

import {Http} from '../service/Http';
import {OpenApi} from '../service/OpenApi';
import {Executor} from '../service/Executor';
import {ExecutionInterceptor} from '../service/ExecutionInterceptor';

export class AppContainer {
  private static container: Container;

  public static getContainer(): Container {
    return AppContainer.container;
  }

  public static build(parameters: IConfigParameters, env: string) {
    if (AppContainer.container) {
      return AppContainer.getContainer();
    }

    const container = new Container({skipBaseClassChecks: true});

    container.bind<string>('env').toConstantValue(env);
    container.bind<IConfigParameters>('parameters').toConstantValue(parameters);

    container.bind<ExecutionInterceptor>('ExecutionInterceptor').to(ExecutionInterceptor);
    container.bind<Http>('Http').to(Http);
    container.bind<Executor>('Executor').to(Executor);
    container.bind<OpenApi>('OpenApi').to(OpenApi);

    AppContainer.container = container;

    return container;
  }
}

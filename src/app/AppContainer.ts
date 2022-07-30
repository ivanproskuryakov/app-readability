import {Container} from 'inversify';


import {OpenApi} from '../service/OpenApi';
import {IConfigParameters} from "../interface/IConfigParameters";

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
    container.bind<OpenApi>('OpenApi').to(OpenApi);

    AppContainer.container = container;

    return container;
  }
}

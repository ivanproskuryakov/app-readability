import {injectable, inject} from "inversify";
import moment from 'moment';
import * as Sentry from '@sentry/node';

import RejectedExecutionException from '../exception/RejectedExecutionException';
import {IConfigParameters} from "../interface/IConfigParameters";

@injectable()
export class ExecutionInterceptor {
  @inject('env')
  protected env: string;
  @inject('parameters')
  protected parameters: IConfigParameters;
  protected timerStarted: moment.Moment;
  protected timoutSeconds: number;
  protected counter: number;

  public init(timoutSeconds: number) {
    this.timoutSeconds = timoutSeconds;
    this.timerStarted = moment();
    this.counter = 0;
  }

  public getCounter(): number {
    return this.counter;
  }

  public rejectExecutionIfFrozen(message: string) {
    const diff = moment().diff(this.timerStarted, 'seconds');

    this.counter++;

    if (diff > this.timoutSeconds) {
      if (!['development', 'test'].includes(this.env)) {
        Sentry.captureException(message);
      }

      throw new RejectedExecutionException(message);
    }
  }
}

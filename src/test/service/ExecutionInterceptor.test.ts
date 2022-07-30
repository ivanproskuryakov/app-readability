import {suite, test, timeout} from '@testdeck/mocha';
import {ExecutionInterceptor} from '../../service/ExecutionInterceptor';
import {expect} from 'chai';

@suite()
export class ExecutionInterceptorTest {
  @test()
  @timeout(20000)
  rejectExecutionIfFrozen() {
    const executionInterceptor = new ExecutionInterceptor(1);

    let err = null;

    try {
      while (true) {
        executionInterceptor.rejectExecutionIfFrozen('reject while after one second ༼☉ ɷ ⊙༽');
      }
    } catch (e: any) {
      err = e;
    }

    expect(executionInterceptor.getCounter()).to.be.greaterThan(10000);
    expect(err.toString()).to.be.eq(
      'RejectedExecutionException: reject while after one second ༼☉ ɷ ⊙༽'
    );
  }
}

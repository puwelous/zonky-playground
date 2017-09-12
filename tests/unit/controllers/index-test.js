import { moduleFor, test } from 'ember-qunit';
import sinonTest from 'ember-sinon-qunit/test-support/test';
import Ember from 'ember';

const {
  A,
  get,
  run,
  set,
} = Ember;


moduleFor('controller:index', 'Unit | Controller | index', {
  // needs: ['controller:foo']
});

test("should initialize member 'sizes' correctly", function (assert) {
  const controller = this.subject();
  assert.deepEqual(
    get(controller, 'sizes'), [
      100,
      200,
      300,
      500,
      1000,
      2000,
    ]);
});

test("should initialize member 'actualSize' correctly", function (assert) {
  const controller = this.subject();
  const sizes = get(controller, 'sizes');
  assert.deepEqual(
    get(controller, 'actualSize'),
    sizes[sizes.length - 1],
  );
});

test("should compute property 'amounts' correctly", function (assert) {
  assert.expect(3);

  const amount1 = 123;
  const amount2 = 931;

  const loans = A([{
    amount: amount1
  }, {
    amount: amount2
  }]);

  const controller = this.subject({
  });

  run(() => set(controller, 'loans', loans));

  run(() => {
    assert.ok(
      get(controller, 'amounts').includes(amount1),
      "aggregated computed property 'amounts' holds the value stored in the field 'amount' of the first loan",
    );

    assert.ok(
      get(controller, 'amounts').includes(amount2),
      "aggregated computed property 'amounts' holds the value stored in the field 'amount' of the second loan",
    );

    assert.equal(
      get(controller, 'amounts.length'),
      get(loans, 'length'),
      'aggregated computed property amounts has same size as loans array',
    );
  });

});

test("should compute property 'sumOfLoanAmount' correctly", function (assert) {
  assert.expect(1);

  const amount1 = 123;
  const amount2 = 931;

  const loans = A([{
    amount: amount1
  }, {
    amount: amount2
  }]);

  const controller = this.subject({
  });

  run(() => set(controller, 'loans', loans));

  run(() => assert.equal(
    get(controller, 'sumOfLoanAmount'),
    amount1 + amount2,
    "computed property 'sumOfLoanAmount' sums up all numbers stored in the loans array under the property amount",
  ));

});

test("should compute property 'actualProgress' as 0 if any depending value is missing", function (assert) {
  assert.expect(2);

  const controller = this.subject();

  run(() => set(controller, 'total', null));

  run(() => assert.equal(
    get(controller, 'actualProgress'),
    0,
    "computed property 'actualProgress' is 0 as property total hasn't been set yet",
  ));

  run(() => {
    set(controller, 'total', 100);
    set(controller, 'loans', { length: null });
  });

  run(() => assert.equal(
    get(controller, 'actualProgress'),
    0,
    "computed property 'actualProgress' is 0 as property loans hasn't been set yet",
  ));
});

test("should compute property 'actualProgress' correctly if all depending values are present", function (assert) {
  assert.expect(2);

  const loans = A([{
    amount: 123
  }, {
    amount: 931
  }]);

  const controller = this.subject();

  run(() => {
    // total 2, current 2 -> 100%
    set(controller, 'total', 2);
    set(controller, 'loans', loans);
  });

  run(() => assert.equal(
    get(controller, 'actualProgress'),
    100,
    "computed property 'actualProgress' is 100 if total === loans.length",
  ));


  // total 4, current 2 -> 50%
  run(() => set(controller, 'total', 4));

  run(() => assert.equal(
    get(controller, 'actualProgress'),
    50,
    "computed property 'actualProgress' is 50 if total === 2 x loans.length",
  ));
});

test("should compute property 'hasAllData' correctly", function (assert) {
  assert.expect(2);

  const loans = A([{
    amount: 123
  }, {
    amount: 931
  }]);

  const controller = this.subject();

  run(() => {
    // total 2, current 2 -> 100%
    set(controller, 'total', 2);
    set(controller, 'loans', loans);
  });

  run(() => assert.ok(
    get(controller, 'hasAllData'),
    "computed property 'hasAllData' is true if actual progress equals 100 (%)",
  ));

  // total 4, current 2 -> 50%
  run(() => set(controller, 'total', 4));

  run(() => assert.notOk(
    get(controller, 'hasAllData'),
    "computed property 'hasAllData' is false if actual progress differs from 100 (%)",
  ));
});

test("should compute property 'averageLoanAmount' as null if not all the data have arrived yet", function (assert) {
  assert.expect(1);

  const loans = A([{
    amount: 123
  }, {
    amount: 931
  }]);

  const controller = this.subject();

  run(() => {
    // total 4, current 2 -> 50%
    set(controller, 'total', 4);
    set(controller, 'loans', loans);
  });

  run(() => assert.deepEqual(
    get(controller, 'averageLoanAmount'),
    null,
    "computed property 'averageLoanAmount' is null as not all data have been loaded yet",
  ));
});

test("should compute property 'averageLoanAmount' as an average amount of all loans if all the data are present", function (assert) {
  assert.expect(1);

  const amount1 = 123;
  const amount2 = 931;

  const loans = A([{
    amount: amount1
  }, {
    amount: amount2
  }]);

  const controller = this.subject();

  run(() => {
    // total 2, current 2 -> 100%
    set(controller, 'total', 2);
    set(controller, 'loans', loans);
  });

  run(() => assert.deepEqual(
    get(controller, 'averageLoanAmount'),
    Math.round((amount1 + amount2) / 2),
    "computed property 'averageLoanAmount' calculates an average loan amount correctly",
  ));
});

test("should use method resetDefaults() to reset properties 'loans' and 'total' to their default vaules", function (assert) {
  assert.expect(2);

  const controller = this.subject();

  run(() => {
    set(controller, 'total', 2);
    set(controller, 'loans', A({
      what: 'ever'
    }));
  });

  run(() => controller.resetDefaults());

  run(() => {
    assert.deepEqual(
      get(controller, 'loans'),
      A(),
      "property 'loans' reset correctly",
    );

    assert.deepEqual(
      get(controller, 'total'),
      null,
      "property 'total' reset correctly",
    );
  });
});

sinonTest("should override method init() to delegate to resetDefaults() and set 'actualSize' property correctly", function (assert) {
  assert.expect(2);

  const controller = this.subject();

  const spyResetDefaults = this.spy(controller, 'resetDefaults');

  run(() => controller.init());

  run(() => {
    assert.ok(spyResetDefaults.calledOnce, 'init() delegates to resetDefaults()');

    assert.deepEqual(
      get(controller, 'actualSize'),
      get(controller, 'sizes.lastObject'),
      "property 'actualSize' set correctly",
    );
  });
});
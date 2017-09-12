import Ember from 'ember';
import { initialize } from 'zonky-playground/instance-initializers/store-initializer';
import { module } from 'qunit';
import destroyApp from '../../helpers/destroy-app';
import sinonTest from 'ember-sinon-qunit/test-support/test';

module('Unit | Instance Initializer | store initializer', {
  needs: ['service:store'],
  beforeEach() {
    Ember.run(() => {
      this.application = Ember.Application.create();
      this.appInstance = this.application.buildInstance();
    });
  },
  afterEach() {
    Ember.run(this.appInstance, 'destroy');
    destroyApp(this.application);
  }
});

// Replace this with your real tests.
sinonTest('it works', function (assert) {
  assert.expect(2);

  const store = {
    push(payload) {
      assert.ok(true, 'store.push() called');
      assert.deepEqual(payload, {
        data: [{
          id: 'AAAAA',
          type: 'rating',
          attributes: {
            name: 'A**',
          }
        }, {
          id: 'AAAA',
          type: 'rating',
          attributes: {
            name: 'A*',
          }
        }, {
          id: 'AAA',
          type: 'rating',
          attributes: {
            name: 'A++',
          }
        }, {
          id: 'AA',
          type: 'rating',
          attributes: {
            name: 'A+',
          }
        }, {
          id: 'A',
          type: 'rating',
          attributes: {
            name: 'A',
          }
        }, {
          id: 'B',
          type: 'rating',
          attributes: {
            name: 'B',
          }
        }, {
          id: 'C',
          type: 'rating',
          attributes: {
            name: 'C',
          }
        }, {
          id: 'D',
          type: 'rating',
          attributes: {
            name: 'D',
          }
        }]
      },
        'pushed payload is correct');
    }
  };

  this.stub(this.appInstance, 'lookup').returns(store);

  initialize(this.appInstance);

});

import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';

const {
  get,
} = Ember;

moduleFor('adapter:loan', 'Unit | Adapter | loan', {
});

test("should override urlForQuery() to append '/marketplace' to the built URL", function (assert) {
  const adapter = this.subject();

  const url = adapter.urlForQuery(/* query, modelName */);

  const expectedUrl = get(adapter, 'host') + get(adapter, 'namespace') + '/marketplace';
  assert.equal(url, expectedUrl, 'the built URL has a correct suffix');
});

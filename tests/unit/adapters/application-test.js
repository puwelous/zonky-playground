import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';
import ENV from '../../../config/environment';

const {
  assign,
  get,
} = Ember;

moduleFor('adapter:application', 'Unit | Adapter | application', {
  needs: [
    'serializer:application',
  ]
});

test("should initialize property 'host' using a respective value from config", function (assert) {
  const adapter = this.subject();
  assert.equal(get(adapter, 'host'), ENV.APP.host, "property 'host' is initialized correctly");
});

test("should initialize property 'namespace' using a respective value from config", function (assert) {
  const adapter = this.subject();
  assert.equal(get(adapter, 'namespace'), ENV.APP.namespace, "property 'namespace' is initialized correctly");
});


test("should override _adjustQPs() to adjust query parameters on the fly", function (assert) {
  const adapter = this.subject();
  const size = 10;
  const page = 1;
  const rating = 'AAAA';
  const fields = ['amount', 'person'];
  const queryParams = {
    page,
    size,
    rating,
    fields,
  };

  const expectedQueryParams = {
    rating__eq: rating,
    fields: 'amount,person',
  };

  assert.deepEqual(
    adapter._adjustQPs(queryParams),
    expectedQueryParams,
    "_adjustQPs() removes unnecessary QPs (page, size) and serializes custom ones (rating, fields) on the fly");
});

test("should define headers property specifying 'accept' and 'content-type' fields", function (assert) {
  const adapter = this.subject();
  const expectedHeaders = {
    'accept': '*/*',
    'content-type': 'application/json;charset=UTF-8',
  };

  assert.deepEqual(
    get(adapter, 'headers'),
    expectedHeaders,
    "property 'headers' is defined correctly");
});

test("should override headersForRequest() to add headers 'X-size' and 'X-page' on the fly", function (assert) {
  const adapter = this.subject();
  const page = 1;
  const size = 10;
  const params = {
    query: {
      page,
      size,
    }
  };

  const defaultHeaders = get(adapter, 'headers');
  const expectedHeaders = assign(defaultHeaders, {
    'X-page': page,
    'X-size': size,
  });

  assert.deepEqual(
    adapter.headersForRequest(params),
    expectedHeaders,
    "headersForRequest() adds headers 'X-size' and 'X-page' correctly");
});

test("should override handleResponse() to parse a header 'x-total' and pass it via meta property", function (assert) {
  const adapter = this.subject();
  const headers = {
    'x-total': 123,
  };

  assert.equal(
    get(adapter.handleResponse(200, headers, {}), 'meta.total'),
    headers['x-total'],
    "handleResponse() moves value stored in the header 'x-total' to the meta field");
});
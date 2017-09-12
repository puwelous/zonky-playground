import DS from 'ember-data';
import Ember from 'ember';
import ENV from '../config/environment';

const {
  assign,
  get,
  isEmpty,
  set,
} = Ember;

export default DS.RESTAdapter.extend({

  /**
   * Zonky endpoint host.
   * @property host
   * @type String
   * @tested
   */
  host: ENV.APP.host,

  /**
   * Zonky endpoint namespace.
   * @property host
   * @type String
   * @tested
   */
  namespace: ENV.APP.namespace,

  /**
   * Default headers added to each request.
   * @property headers
   * @type Object
   * @tested
   */
  headers: {
    // 'X-size' added in headersForRequest() ,
    // 'X-page': added in headersForRequest(),
    'accept': '*/*',
    'content-type': 'application/json;charset=UTF-8',
  },

  /**
   * Removes the QPs 'size', 'page', and adds custom ones
   * rating and fields on the fly.
   * Zonky backend uses headers for specifying bath size and page order,
   * as it also requires specific format of the filtered values (rating -> rating__eq)
   * and retrieving specific (cherry-picking) values only (fields).
   * @example
   * // we query only records with 'rating' equal 'A'
   * ...url?...&rating__eq=A
   * // we query only fields (properties) we need, say 'age', 'name':
   * ...url?...&fields=age,name
   * @method _adjustQPs
   * @returns Object adjusted query params holder object
   * @private
   * @tested
   */
  _adjustQPs(superData) {
    const superDataRef = superData;

    if ('page' in superDataRef) {
      delete superDataRef.page;
    }

    if ('size' in superDataRef) {
      delete superDataRef.size;
    }

    if ('rating' in superDataRef) {
      set(superDataRef, 'rating__eq', superDataRef.rating);
      delete superDataRef.rating;
    }

    if ('fields' in superDataRef && !isEmpty(superDataRef.fields)) {
      set(superDataRef, 'fields', superDataRef.fields.join(','));
    }

    return superDataRef;
  },

  /**
   * Adds headers: 'X-size', 'X-page' on the fly, 
   * retrieving their values from the given {params.query} argument.
   * @method headersForRequest
   * @overrides
   * @returns Object default headers enriched with X-size and X-page entries.
   * @tested
   */
  headersForRequest(params) {
    const superHeaders = this._super(...arguments);

    assign(superHeaders, {
      'X-page': get(params, 'query.page'),
      'X-size': get(params, 'query.size'),
    });

    return superHeaders;
  },

  /**
   * Delegates to _adjustQPs() in order to adjust QPs to satisfy
   * Zonky backend's rules.
   * @see _adjustQPs()
   * @method dataForRequest
   * @overrides
   * @returns Object query params container adjust to the Zonky backend rules
   */
  dataForRequest() {
    let superData = this._super(...arguments);

    superData = this._adjustQPs(superData);

    return superData;
  },

  /**
   * Takes the value stored in 'x-total' and sets it upon the payload's meta property.
   * @method handleResponse
   * @overrides
   * @returns Object payload with meta property enriched with 'total' entry. 
   * @tested
   */
  handleResponse(status, headers) {

    const superReturnValue = this._super(...arguments);

    if ('x-total' in headers && !isNaN(get(headers, 'x-total'))) {
      superReturnValue.meta = superReturnValue.meta || {};
      superReturnValue.meta.total = Number(get(headers, 'x-total'));
    }

    return superReturnValue;
  }

});

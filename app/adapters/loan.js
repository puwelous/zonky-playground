import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({

   /**
    * Overrides urlForQuery() to append /marketplace to the generated URL
    * since loans' endpoint sits on /loans/markeplace instead of /loans as 
    * is usual in guessed enpoint.
    * @method urlForQuery
    * @overrides
    * @tested
    */
   urlForQuery() {
      const superUrl = this._super(...arguments);
      return `${superUrl}/marketplace`;
   },

});

import Ember from 'ember';

const {
   A,
   computed,
   Controller,
   get,
   isBlank,
   setProperties,
} = Ember;

export default Controller.extend({

   /**
    * Sizes for x-size header shown in selectbox.
    * @property sizes
    * @type [Number]
    * @default [100, 200, 300, 500, 1000, 2000]
    * @tested
    */
   sizes: [
      100,
      200,
      300,
      500,
      1000,
      2000,
   ],

   /**
    * Currently selected x-size within the selectbox.
    * @property actualSize
    * @type Number
    * @default null
    * @tested
    */
   actualSize: null,

   /**
    * Aggregated array that contains values kept under the 'amount' property of the loans.
    * In other words, a container of all loans amounts.
    * @property amounts
    * @type Computed<[Number]>
    * @tested
    */
   amounts: computed.mapBy('loans', 'amount'),
   
   /**
    * Aggregated array that contains values kept under the 'amount' property of the loans.
    * In other words, a container of all loans amounts.
    * @property amounts
    * @type Computed<Number>
    * @tested
    */
   sumOfLoanAmount: computed.sum('amounts'),
   
   /**
    * Flag indicating whether all the data for the current computation task have arrived.
    * True, if all data have arrived, otherwise false.
    * @property actualProgress
    * @type Computed<Boolean>
    * @tested
    */
    hasAllData: computed.equal('actualProgress', 100),

   /**
    * Actual progress value indicating how many items have been already loaded.
    * Calculated as %.
    * @property actualProgress
    * @type Computed<Number>
    * @tested
    */
   actualProgress: computed('loans.length', 'total', function () {
      try {
         const total = get(this, 'total');
         const loansCount = get(this, 'loans.length');

         if (isBlank(total) || isBlank(loansCount)) {
            return 0;
         }

         const actualProgressInPercent = ((loansCount * 100) / total);
         return Math.round(actualProgressInPercent);
      } catch (_) {
         return 0;
      }

   }),

   /**
    * Computes an average loan amount upon the all given loans.
    * The word 'amount' is bit confusing here since it does not represent loans count,
    * but amount of money the loan is for. We sticked to the naming provided by Zonky's
    * backend, hence the bit confusing property name origins.
    * @property averageLoanAmount
    * @type Computed<Number>
    * @tested
    */
   averageLoanAmount: computed('hasAllData', 'sumOfLoanAmount', 'loans.length', function () {
      if (!get(this, 'hasAllData')) {
         return null;
      }

      return Math.round(Number(get(this, 'sumOfLoanAmount')) / Number(get(this, 'loans.length')));
   }),

   /**
    * Resets the 'loans' and 'total' to their default values.
    * This is needes for 'reseting' the state between sequential
    * average loan computation tasks.
    * @method resetDefaults
    * @tested
    */
   resetDefaults() {
      setProperties(this, {
         'loans': A(),
         'total': null,
      });
   },

   /**
    * Delegates to resetDefaults() and selects the x-size option for the selectbox.
    * Currently, we select the last one from the 'sizes' array. 
    * @see resetDefaults()
    * @method init
    * @overrides
    * @tested
    */
   init() {
      this._super(...arguments);
      this.resetDefaults();
      this.actualSize = this.sizes[this.sizes.length - 1];
   },

});

import Ember from 'ember';
import { task /* , timeout */ } from 'ember-concurrency';
import Rating from '../models/rating';

Rating.reopen({
   isSelected: false
});

const {
   get,
   isEmpty,
   Route,
   run,
   set,
} = Ember;

export default Route.extend({

   model() {
      return this.store.peekAll('rating');
   },

   setupController(controller) {
      this._super(...arguments);
      set(controller, 'loadAllDataTask', get(this, 'loadAllDataTask'));
   },

   actions: {

      cancelTask() {
         get(this, 'loadAllDataTask').cancelAll();
      },

      loadLoansForRating(ratingInstance, startPage = 0, actualSize = 100) {
         const rating = get(ratingInstance, 'id');
         const currentlySelected = get(this, 'controller.model').findBy('isSelected', true);

         if (!!currentlySelected && currentlySelected === ratingInstance) {
            return;
         }

         run(() => {
            if (!isEmpty(currentlySelected)) {
               set(currentlySelected, 'isSelected', false);
            }

            set(ratingInstance, 'isSelected', true);
         });

         run.next(() => get(this, 'loadAllDataTask').perform(rating, startPage, actualSize));

      }
   },

   loadAllDataTask: task(function* (rating, startPage, size) {
      try {
         let page = startPage;
         const fields = ['id', 'rating', 'amount'];
         const controller = get(this, 'controller');

         controller.resetDefaults();

         const firstLoadPromise = this.store.query('loan', {
            rating,
            page,
            size,
            fields,
         });

         const firstLoadResponse = yield firstLoadPromise;

         const currentLoans = get(controller, 'loans.content');
         firstLoadResponse.unshiftObjects(currentLoans);
         set(controller, 'loans', firstLoadResponse);

         const total = get(firstLoadResponse, 'meta.total');

         set(controller, 'total', total);

         while (total > get(controller, 'loans.length')) {
            console.log('need to load more!', total, get(controller, 'loans.length'));

            page += 1;

            const nextLoadPromise = this.store.query('loan', {
               rating,
               page,
               size,
               fields,
            });

            const nextLoadResponse = yield nextLoadPromise;

            const currentLoans = get(controller, 'loans.content');
            nextLoadResponse.unshiftObjects(currentLoans);
            set(controller, 'loans', nextLoadResponse);

         }

         console.log('done!');

         return get(controller, 'loans');

      } catch (e) {
         console.error(e);
      }
   }),

});

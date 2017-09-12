import DS from 'ember-data';

export default DS.Model.extend({
   rating: DS.attr('string'), 
   amount: DS.attr('number'),
});

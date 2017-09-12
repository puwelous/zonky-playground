// A** A* A++ A+ A B C D
export function initialize(applicationInstance) {

  const store = applicationInstance.lookup('service:store');

  store.push({
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
  });

}

export default {
  name: 'store-initializer',
  initialize: initialize
};
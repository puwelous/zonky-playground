// import Mirage from 'ember-cli-mirage';

// import reponse0 from './mocks/D/page_0';
// import reponse1 from './mocks/D/page_1';
// import reponse2 from './mocks/D/page_2';
// import reponse3 from './mocks/D/page_3';
// import reponse4 from './mocks/D/page_4';


export default function () {

  this.timing = 1500; // approx. TTFB of Zonky

  this.urlPrefix = 'https://private-718ad-zonky.apiary-proxy.com/';
  this.namespace = '/loans';

  this.passthrough();

  // this.get('/marketplace', function (db, request) {

  //   //console.log(request);

  //   const qpRating = request.queryParams.rating__eq;
  //   const headerXPage = Number(request.requestHeaders["X-page"]);

  //   let response;

  //   switch (headerXPage) {
  //     case 0:
  //       response = reponse0;
  //       break;
  //     case 1:
  //       response = reponse1;
  //       break;
  //     case 2:
  //       response = reponse2;
  //       break;
  //     case 3:
  //       response = reponse3;
  //       break;
  //     case 4:
  //       response = reponse4;
  //       break;
  //     default:
  //       console.error('ember-cli-mirage condig: way too many requests! Max. 5 were awaited!');
  //   }

  //   return new Mirage.Response(200, {
  //     'x-total': (reponse0.length + reponse1.length + reponse2.length + reponse3.length + reponse4.length),
  //   },
  //     response,
  //     2000,
  //   );

  // });

}

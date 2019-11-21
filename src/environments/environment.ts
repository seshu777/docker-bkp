// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  apiUrl: 'http://52.55.126.249',
  portUsermgmt: ':8081',
  portJournalmgmt: ':8082',
  portLocations: ':8089',
  portOrgs: '8084',
  firebase: {
    apiKey: "AIzaSyA2gpn5H7ymP_Cq3i-SCd6Nw9nX85j7qJE",
    authDomain: "conference-management-sy-4cc34.firebaseapp.com",
    databaseURL: "https://conference-management-sy-4cc34.firebaseio.com",
    projectId: "conference-management-sy-4cc34",
    storageBucket: "",
    messagingSenderId: "600992934601",
    appId: "1:600992934601:web:d77307a62918d89f3bbb18",
    measurementId: "G-CS1PPB3HJ9"
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

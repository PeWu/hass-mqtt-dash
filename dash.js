class DashController {
  constructor(hassMqtt) {
    this.data = {};
    hassMqtt.registerCallback((data) => {
      this.data = data;
    });
  }
}

const dashApp = angular.module('dashApp', ['hassMqtt']);
dashApp.controller('DashController', DashController);
dashApp.filter('toArray', () => (obj) => Object.values(obj));

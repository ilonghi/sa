(function () {

  'use strict';

  angular

    .module('sirti-utils', [
      'angular-growl',
      'ngAnimate',
      'ngSanitize',
      'ui.bootstrap'
    ])

    .provider('sirtiUtilsConfig', function (growlProvider) {
      var that = this;
      this.sirtiAlertPosition = 'top-center';
      this.setSirtiAlertPosition = function(position) {
        that.sirtiAlertPosition = position;
        growlProvider.globalPosition(that.sirtiAlertPosition);
      };
      this.sirtiAlertDefaultLimitMessages = 5;
      this.setSirtiAlertDefaultLimitMessages = function(defaultLimitMessages) {
        this.sirtiAlertDefaultLimitMessages = defaultLimitMessages;
      };
      this.$get = function () {
        return this;
      };
    })

    .config(function(growlProvider, sirtiUtilsConfigProvider) {
      growlProvider.globalTimeToLive({
        success : 3000,
        error : 3000,
        warning : 3000,
        info : 3000
      });
      growlProvider.globalPosition(sirtiUtilsConfigProvider.sirtiAlertPosition);
      growlProvider.globalInlineMessages(false);
      growlProvider.onlyUniqueMessages(false);
    })

  ;

})();
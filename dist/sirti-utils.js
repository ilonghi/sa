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
(function () {

  'use strict';

  const defaultReference = 9999999;

  function sirtiAlertCtrl($scope, sirtiUtilsConfig) {
    $scope.reference = $scope.reference || defaultReference;
    $scope.limitMessages = $scope.limitMessages || sirtiUtilsConfig.sirtiAlertDefaultLimitMessages;
  }

  function formatMsg(o) {
    var msg;
    if(angular.isObject(o)) {
      if(angular.isObject(o.data) && o.data.message && o.data.UUID) {
        msg = '<div><p>' + o.data.message + '</p></div>';
        msg += o.data.internalMessage ? '<div><p><em>Error detail</em>: ' + o.data.internalMessage + '</p></div>' : '';
        msg += '<div>(UUID: <code>' + o.data.UUID + '</code>)</div>';
      } else if(o.data === '' && o.status !== -1 && o.statusText) {
        msg = '<div><p><em>' + o.status + ' ' + o.statusText + '</em></p></div>';
      } else {
        msg = '<div><p><em>Unknown error</em></p></div>';
      }
    } else {
      msg = o;
    }
    return msg;
  }

  function setConfig(config, defaultConfig) {
    if(!angular.isObject(config)) {
      config = defaultConfig;
    }
    Object.keys(defaultConfig).forEach(function(k) {
      config[k] = k in config ? config[k] : defaultConfig[k];
    });
    if(!config.referenceId) {
      config.referenceId = defaultReference;
    }
    return config;
  }

  function showAlert(type, defaultConfig, growl, messages, msg, config) {
    config = setConfig(config, defaultConfig);
    messages.push(growl[type](formatMsg(msg), config));
  }

  angular
  
    .module('sirti-utils')

    .factory('sirtiAlert', function(growl) {
      var messages = [];
      return {
        fatal: function(msg, config) {
          showAlert('error', { ttl: -1, disableCloseButton: true }, growl, messages, msg, config);
        },
        error: function(msg, config) {
          showAlert('error', { ttl: -1 }, growl, messages, msg, config);
        },
        warning: function(msg, config) {
          showAlert('warning', {}, growl, messages, msg, config);
        },
        success: function(msg, config) {
          showAlert('success', {}, growl, messages, msg, config);
        },
        info: function(msg, config) {
          showAlert('info', {}, growl, messages, msg, config);
        },
        clear: function(){
          for(var i=0; i<messages.length; i++) {
            if(angular.isDefined(messages[i])) {
              messages[i].destroy();
            }
          }
          messages = [];
        }
      };
    })

    /**
     * direttiva sirti-alert
     */
    .directive('sirtiAlert', function() {
      return {
        restrict: 'E',
        scope: {
          reference: '@',
          inline: '=',
          limitMessages: '@'
        },
        templateUrl: 'views/directives/sirti-alert.html',
        controller: sirtiAlertCtrl
      };
    })

  ;

})();
(function() {

  'use strict';

  angular

    .module('sirti-utils')

    .service('sirtiLoadingModal', function($uibModal, sirtiAlert) {
      this.open = function() {
        sirtiAlert.clear();
        return $uibModal.open({
          ariaDescribedBy: 'modal-body',
          templateUrl: 'views/services/sirti-loading-modal.html',
          keyboard: false,
          backdrop: 'static'
        });
      };
    })

  ;

})();
angular.module('sirti-utils').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/directives/sirti-alert.html',
    "<div growl\n" +
    "\treference=\"{{reference}}\"\n" +
    "\tinline=\"inline\"\n" +
    "\tlimit-messages=\"limitMessages\"\n" +
    "></div>"
  );


  $templateCache.put('views/services/sirti-loading-modal.html',
    "<div class=\"modal-dialog modal-sm text-center\">\n" +
    "\t<div class=\"sirti-utils-loading-modal\">\n" +
    "\t\t<span class=\"glyphicon glyphicon-repeat sirti-utils-glyphicon-animate\"></span>\n" +
    "\t</div>\n" +
    "</div>"
  );

}]);

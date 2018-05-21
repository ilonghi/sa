(function () {

  'use strict';

  const defaultReference = 9999999;

  function sirtiAlertCtrl($scope, sirtiAlertConfig) {
    $scope.reference = $scope.reference || defaultReference;
    $scope.limitMessages = $scope.limitMessages || sirtiAlertConfig.defaultLimitMessages;
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

  angular.module('sirti-alert', ['angular-growl', 'ngAnimate'])

    .provider('sirtiAlertConfig', function (growlProvider) {
      var that = this;
      this.position = 'top-center';
      this.setPosition = function(position) {
        that.position = position;
        growlProvider.globalPosition(that.position);
      };
      this.defaultLimitMessages = 5;
      this.setDefaultLimitMessages = function(defaultLimitMessages) {
        this.defaultLimitMessages = defaultLimitMessages;
      };
      this.$get = function () {
        return this;
      };
    })

    .config(function(growlProvider, sirtiAlertConfigProvider) {
      growlProvider.globalTimeToLive({
        success : 3000,
        error : 3000,
        warning : 3000,
        info : 3000
      });
      growlProvider.globalPosition(sirtiAlertConfigProvider.position);
      growlProvider.globalInlineMessages(false);
      growlProvider.onlyUniqueMessages(false);
    })

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
        templateUrl: 'sirti-alert.html',
        controller: sirtiAlertCtrl
      };
    })

  ;

})();
angular.module('sirti-alert').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('sirti-alert.html',
    "<div growl\n" +
    "\treference=\"{{reference}}\"\n" +
    "\tinline=\"inline\"\n" +
    "\tlimit-messages=\"limitMessages\"\n" +
    "></div>"
  );

}]);

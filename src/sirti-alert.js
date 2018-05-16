(function () {

  'use strict';

  const defaultReference = 9999999;
  const defaultPosition = 'top-center';

  function sirtiAlertCtrl($scope) {
    $scope.reference = $scope.reference || defaultReference;
    $scope.limitMessages = $scope.limitMessages || 5;
  }

  function formatMsg(o) {
    var msg = '';
    if(angular.isObject(o)) {
      msg += o.message ? '<div><p>' + o.message + '</p></div>' : '';
      msg += o.internalMessage ? '<div><p><em>Error detail</em>: ' + o.internalMessage + '</p></div>' : '';
      msg += o.UUID ? '<div class="push-right small uuid">(UUID: <code>' + o.UUID + '</code>)</div>' : '';
      if(msg === '') {
        msg = '<div><p><em>Unknown message</em></p></div>';
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

  angular.module('sirtiAlert', ['angular-growl', 'ngAnimate'])

    .provider('sirtiAlertConfig', function () {
      // default
      this.threshold = 0.15;
      this.setThreshold = function(threshold) {
        this.threshold = threshold;
      };
      this.$get = function () {
        return this;
      };
    })

    .config(['growlProvider', function(growlProvider) {
      growlProvider.globalTimeToLive({
        success : 3000,
        error : 3000,
        warning : 3000,
        info : 3000
      });
      growlProvider.globalPosition(defaultPosition);
      growlProvider.globalInlineMessages(false);
      growlProvider.onlyUniqueMessages(false);
    }])

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
     * 
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
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
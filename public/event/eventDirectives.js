myApp.directive('myEnter', function() {
    return function(scope, element, attrs) {
        element.bind('keydown keypress', function(event) {
            if(event.which === 13) {
                scope.$apply(function(){
                    scope.$eval(attrs.myEnter);
                });
                
                event.preventDefault();
            }
        })
    }
})

myApp.directive('ngConfirmClick', [
  function(){
    return {
      priority: -1,
      restrict: 'A',
      link: function(scope, element, attrs){
        element.bind('click', function(e){
          var message = attrs.ngConfirmClick;
          // confirm() requires jQuery
          if(message && !confirm(message)){
            e.stopImmediatePropagation();
            e.preventDefault();
          }
        });
      }
    }
  }
]);


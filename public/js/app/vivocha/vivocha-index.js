'use strict';
angular
    .module('vvc',[])
    .constant('vvc_acct_name','vvc_demo')
    .controller('vvcTest',['$scope','$rootScope',function($scope,$rootScope){

      $rootScope.$on('cart:updated',function(event,obj){

        if (vivocha){
          vivocha.ready(function(){
            if (vivocha.contact) {
                console.log("request-->",obj.cart, JSON.stringify(obj.cart));
                vivocha.contact.request("cart_updated", {
                  cart_id : obj.cart.id,
                  customer_id: obj.cart.customerId
                });
                console.log("vivocha sent request")
            }

          })
        }
        else console.log("vivocha is undefined");
        console.log("cart updated", obj);
      })

      $rootScope.$on('authtoken:obtained',function(event,obj){
        console.log("authtoken:obtained", obj);
      })


    }])
    .directive('vvcScript',['vvc_acct_name',function(vvc_acct_name) {
      return {
        restrict: 'A',
        link: function () {
          console.log("linking vvcScript",vvc_acct_name);
          var head = document.getElementsByTagName("head")[0];
          var js = document.createElement("script");
          js.type = "text/javascript";
          js.src = "//www.vivocha.com/a/"+vvc_acct_name+"/api/vivocha.js";
          head.appendChild(js);

        }
      }
    }])
;
'use strict';
angular
    .module('vvc',[])
    .constant('vvc_acct_name','vvc_demo')
    .controller('vvcTest',['$scope','$rootScope',function($scope,$rootScope){

      $rootScope.$on('cart:updated',function(event,obj){
        vivocha_send("cart_updated",obj.cart);
      });

      $rootScope.$on('user:signedin',function(event,obj) {
        vivocha_send("user_signedin",obj);
      });

      $rootScope.$on('user:signedout',function(event,obj) {
        vivocha_send("user_signedout",obj);
      });

      function vivocha_send(evt,obj){
        if (typeof vivocha != "undefined"){
          vivocha.ready(function(){
            if (vivocha.contact) {
              console.log("vvcsend",evt,JSON.parse(angular.toJson(obj)));
              vivocha.contact.request(evt, JSON.parse(angular.toJson(obj)));
            }
          })
        }
        else console.log("vivocha_send","vivocha id undefined");
      }

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
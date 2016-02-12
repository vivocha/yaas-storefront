'use strict';
angular
    .module('vvc',[])
    .constant('vvc_acct_name','yaasdemo')
    .directive('vvcScript',['vvc_acct_name','$window','$rootScope',function(vvc_acct_name,$window,$rootScope) {
      return {
        restrict: 'A',
        link: function () {
          console.log("linking vvcScript",vvc_acct_name);
          window.vvc_ready_handlers = [];
          window.vivocha = { ready: function(cb) { window.vvc_ready_handlers.push(cb); }}

          var head = document.getElementsByTagName("head")[0];
          var js = document.createElement("script");
          js.type = "text/javascript";
          js.src = "//www.vivocha.com/a/"+vvc_acct_name+"/api/vivocha.js";
          head.appendChild(js);
          //$window.vvc_ready_handlers = [];
          //$window.vivocha = { ready: function(cb) { $window.vvc_ready_handlers.push(cb); }}
          //$rootScope.showCart = true;

        }
      }
    }])
    .controller('vvcTest',['$scope','$rootScope','$window','$timeout',function($scope,$rootScope,$window,$timeout){

      var theCart = {};

      $timeout(function(){

        vivocha.ready(function(){
          console.log("READY CALLED");

          vivocha.events.on("contact",function(contact){
            console.log("CONTACT CALLED");
            contact.on("cart:get",function(data,cb){
              cb(null,JSON.parse(angular.toJson(theCart)));
            })
          })

        })
      },500);

      $rootScope.$on('cart:updated',function(event,obj){
        theCart = obj.cart;
        vivocha_send("cart:updated",obj.cart);
      });

      $rootScope.$on('user:signedin',function(event,obj) {
        vivocha_send("user:signedin",obj);
      });

      $rootScope.$on('user:signedout',function(event,obj) {
        vivocha_send("user:signedout",obj);
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

;


var products = {};

var ids = _.keys(items);

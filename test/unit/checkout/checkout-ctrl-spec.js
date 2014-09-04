ddescribe('CheckoutCtrl', function () {

    var $scope, $rootScope, $controller, $injector, $q, mockedCheckoutSvc, checkoutCtrl, order, cart, checkoutDfd, $modal, mockedModal, shippingCostsDfd, shippingCost;
    var MockedAuthSvc = {
        isAuthenticated: jasmine.createSpy('isAuthenticated'),
        getDefaultAddress: jasmine.createSpy('getDefaultAddress').andReturn({
            then: jasmine.createSpy('then')
        }),
        getAddresses: jasmine.createSpy('getAddresses').andReturn({
            then: jasmine.createSpy('then')
        })
    };
    var GlobalData = {
        user: {
            isAuthenticated: '',
            user: null
        }
    };
    var AuthDialogManager = {
        isOpened: jasmine.createSpy('then'),
        open: jasmine.createSpy('then').andReturn({
            result: {
                then: jasmine.createSpy('then')
            }
        }),
        close: jasmine.createSpy('dismiss')
    };
    var ERROR_TYPES = {
            stripe: 'STRIPE_ERROR',
            order: 'ORDER_ERROR'
        };
    var mockBillTo = {'firstName': 'Bob', 'lastName':'Sushi'};
    var mockedState = {};
    mockedState.go = jasmine.createSpy('go');
    var formName = 'checkoutForm';

    //***********************************************************************
    // Common Setup
    // - shared setup between constructor validation and method validation
    //***********************************************************************

    beforeEach(module('restangular'));
    beforeEach(module('ds.checkout', function($provide) {
        order = {};
        order.shipTo = {};
        cart = {};
        order.creditCard = {};
        shippingCost = {};
        shippingCost.price = {};
        shippingCost.price.price = 4.99;
        mockedCheckoutSvc =  {
            ERROR_TYPES: ERROR_TYPES
        };
        mockedModal = {
            open: jasmine.createSpy('open').andReturn({
                opened: {
                    then: jasmine.createSpy('then')
                },
                dismiss: jasmine.createSpy('dismiss')
            })
        };

        $provide.value('cart', cart);
        $provide.value('order', order);
        $provide.value('shippingCost', shippingCost);
        $provide.value('$state', mockedState);
        $provide.value('$modal', mockedModal);
        $provide.value('GlobalData', GlobalData);
    }));

    beforeEach(inject(function(_$rootScope_, _$controller_, _$injector_, _$q_, _$modal_) {

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
        $rootScope =  _$rootScope_;
        $q =  _$q_;
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        $injector = _$injector_;
        $modal = _$modal_;
    }));

    beforeEach(function () {
        checkoutDfd = $q.defer();

        mockedCheckoutSvc.checkout = jasmine.createSpy('checkout').andCallFake(function() {
            return checkoutDfd.promise;
        });

        checkoutCtrl = $controller('CheckoutCtrl', {$scope: $scope, CheckoutSvc: mockedCheckoutSvc, AuthDialogManager: AuthDialogManager, AuthSvc: MockedAuthSvc});
    });

    describe('initialization', function () {
        it('should create default instances', function () {
            expect(checkoutCtrl).toBeTruthy();
            expect($scope.order).toBeTruthy();
            expect($scope.wiz).toBeTruthy();
        })
    });

    describe('Mobile Wizard Step completion', function () {
        beforeEach(function () {
            $scope.wiz.step1Done = false;
            $scope.wiz.step2Done = false;
            $scope.wiz.step3Done = false;
            $scope.showPristineErrors = false;
        });

        it('should set Step 1 Done when Bill-To to entered', function(){
            $scope.billToDone(true);
            expect($scope.wiz.step1Done).toEqualData(true);
            expect($scope.wiz.step2Done).toEqualData(false);
            expect($scope.wiz.step2Done).toEqualData(false);
            expect($scope.showPristineErrors).toEqualData(false);
        });

        it('should leave Step 1 In Progress when invalid Bill-To entered', function(){
            $scope.billToDone(false);
            expect($scope.wiz.step1Done).toEqualData(false);
            expect($scope.wiz.step2Done).toEqualData(false);
            expect($scope.wiz.step2Done).toEqualData(false);
            expect($scope.showPristineErrors).toEqualData(true);
        });

        it('should remove PRISTINE_ERRORS upon valid re-edit of Bill-To', function(){
            $scope.showPristineErrors = true;
            $scope.billToDone(true);
            expect($scope.showPristineErrors).toEqualData(false);
        });

        it('should set Step 2 Done when ship to to entered', function(){
            $scope.wiz.step2Done = false;
            $scope.shipToDone(true);
            expect($scope.wiz.step2Done).toEqualData(true);
            expect($scope.wiz.step3Done).toEqualData(false);

        });

        it('should leave Step 2 In Progress when invalid Ship-To entered', function(){
            $scope.wiz.step2Done = false;
            $scope.wiz.shipToSameAsBillTo = false;
            $scope.shipToDone(false);
            expect($scope.wiz.step2Done).toEqualData(false);
            expect($scope.wiz.step3Done).toEqualData(false);
            expect($scope.showPristineErrors).toEqualData(true);
        });

        it('should set Step 3 Done when shipping entered', function(){
            $scope.wiz.step3Done = false;
            $scope.paymentDone(true, 'form');
            expect($scope.wiz.step3Done).toEqualData(true);
        });

        it('should leave Step 3 In Progress when invalid Payment entered', function(){
            $scope.wiz.step3Done = false;
            $scope.paymentDone(false);
            expect($scope.wiz.step3Done).toEqualData(false);
            expect($scope.showPristineErrors).toEqualData(true);
        });

    });

    describe('Wizard in Mobile - Editing Complete Information', function () {
        beforeEach(function () {
            $scope.wiz.step1Done = true;
            $scope.wiz.step2Done = true;
            $scope.wiz.step3Done = true;
        });

        it(' (Bill To) should set Steps 1,2, 3 undone', function () {

            $scope.editBillTo();
            expect($scope.wiz.step1Done).toEqualData(false);
            expect($scope.wiz.step2Done).toEqualData(false);
            expect($scope.wiz.step3Done).toEqualData(false);
        });

        it(' (Ship To) should set Steps 2, 3 undone', function () {

            $scope.editShipTo();
            expect($scope.wiz.step1Done).toEqualData(true);
            expect($scope.wiz.step2Done).toEqualData(false);
            expect($scope.wiz.step3Done).toEqualData(false);
        });

        it(' (Shipping) should set Steps 3 undone', function () {
            $scope.editPayment();
            expect($scope.wiz.step1Done).toEqualData(true);
            expect($scope.wiz.step2Done).toEqualData(true);
            expect($scope.wiz.step3Done).toEqualData(false);
        });

    });

    describe('setShipToSameAsBillTo', function () {

        it('should copy billing to shipping', function(){
            $scope.order.billTo = mockBillTo;
            $scope.setShipToSameAsBillTo();
            expect($scope.order.shipTo).toEqualData(mockBillTo);
        });
    });

    describe('Place Order', function () {

        beforeEach(function () {
            $scope.showPristineErrors = false;
        });

        it('should invoke CheckoutSvc create order if form valid', function(){
            $scope.placeOrder(true, formName);
            expect(mockedCheckoutSvc.checkout).toHaveBeenCalled();
        });

        it('should not place order if form invalid', function(){
            $scope.placeOrder(false, formName);
            expect(mockedCheckoutSvc.checkout).wasNotCalled();
        });

        it('should show pristine errors if form invalid', function(){
            $scope.placeOrder(false, formName);
            expect($scope.showPristineErrors).toEqualData(true);
        });

        it('should show default error msg if form invalid', function(){
            $scope.placeOrder(false, formName);
            expect($scope.message).toEqualData('');
        });

        it('should ensure ship to copy', function(){
            order.billTo = mockBillTo;
            $scope.wiz.shipToSameAsBillTo = true;
            $scope.placeOrder(true, formName);
            expect(order.shipTo).toEqualData(mockBillTo);
        });
    });

    describe('Stripe Error Handling', function(){
        var stripeError, errorMsg, setValidityMock;
        var fieldErrorMsg = '';

        beforeEach(inject(function($q) {
            $scope.checkoutForm = {};
            $scope.checkoutForm.paymentForm ={};
            $scope.checkoutForm.paymentForm.ccNumber = {};
            setValidityMock =  jasmine.createSpy('$setValidity');
            $scope.checkoutForm.paymentForm.ccNumber.$setValidity = setValidityMock;
            $scope.checkoutForm.paymentForm.cvc = {};
            $scope.checkoutForm.paymentForm.cvc.$setValidity = setValidityMock;
            $scope.checkoutForm.paymentForm.expMonth = {};
            $scope.checkoutForm.paymentForm.expMonth.$setValidity = setValidityMock;
            $scope.checkoutForm.paymentForm.expYear = {};
            $scope.checkoutForm.paymentForm.expYear.$setValidity = setValidityMock;

            errorMsg = 'msg';

            stripeError = {};
            stripeError.message = errorMsg;
            stripeError.code = 'number';
            stripeError.type = 'card_error';

            $scope.wiz.step1Done = true;
            $scope.wiz.step2Done = true;
            $scope.wiz.step3Done = true;
            $scope.message = false;
        }));

        it('should edit payment on card error', function(){
            $scope.placeOrder(true, formName);
            checkoutDfd.reject({ type: ERROR_TYPES.stripe, error: stripeError });
            $scope.$digest();
            expect($scope.wiz.step3Done).toEqualData(false);
        });

        it('should set error message', function(){
            stripeError.type = null;
            $scope.placeOrder(true, formName);

            checkoutDfd.reject({ type: ERROR_TYPES.stripe, error: stripeError });
            $scope.$digest();

            expect($scope.message).toEqualData('Not able to pre-validate payment at this time.');

        });


        it('should update validity on cc number error', function(){
            $scope.placeOrder(true, formName);
            expect(setValidityMock).not.toHaveBeenCalled();
            checkoutDfd.reject({ type: ERROR_TYPES.stripe, error: stripeError });
            $scope.$digest();
            expect(setValidityMock).toHaveBeenCalled();
            expect($scope.message).toEqualData(fieldErrorMsg);
        });

        it('should update validity on cvc error', function(){
            stripeError.code = 'cvc';
            $scope.placeOrder(true, formName);
            checkoutDfd.reject({ type: ERROR_TYPES.stripe, error: stripeError });
            $scope.$digest();
            expect(setValidityMock).toHaveBeenCalled();
            expect($scope.message).toEqualData(fieldErrorMsg);
        });

        it('should update validity on month error', function(){
            stripeError.code = 'month';
            $scope.placeOrder(true, formName);
            checkoutDfd.reject({ type: ERROR_TYPES.stripe, error: stripeError });
            $scope.$digest();
            expect(setValidityMock).toHaveBeenCalled();
            expect($scope.message).toEqualData(fieldErrorMsg);
            expect($scope.checkoutForm.paymentForm.expDateMsg).toEqualData('');
        });

        it('should update validity on year error', function(){
            stripeError.code = 'year';
            $scope.placeOrder(true, formName);
            checkoutDfd.reject({ type: ERROR_TYPES.stripe, error: stripeError });
            $scope.$digest();
            expect(setValidityMock).toHaveBeenCalled();
            expect($scope.message).toEqualData(fieldErrorMsg);
            expect($scope.checkoutForm.paymentForm.expDateMsg).toEqualData('');
        });
    });

    describe('reset CC expiration date errors', function(){
        var setValidityMock;

        beforeEach(function(){
            setValidityMock =  jasmine.createSpy('$setValidity');
            $scope.checkoutForm = {};
            $scope.checkoutForm.paymentForm ={};
            $scope.checkoutForm.paymentForm.expMonth = {};
            $scope.checkoutForm.paymentForm.expMonth.$setValidity = setValidityMock;
            $scope.checkoutForm.paymentForm.expYear = {};
            $scope.checkoutForm.paymentForm.expYear.$setValidity = setValidityMock;
            $scope.resetExpDateErrors();
        });

        it('should reset the submission message', function(){
           expect($scope.message).toBeFalsy();
        });

        it('should reset the CC expiration date error message', function(){
            expect($scope.checkoutForm.paymentForm.expDateMsg).toBeFalsy();
        });

        it('should reset validity of date fields', function(){
            expect(setValidityMock).toHaveBeenCalledWith('validation',true);
        });

    });

    describe('reset custom field error', function(){
       var setValidityMock;
        beforeEach(function(){
            setValidityMock =  jasmine.createSpy('$setValidity');
            $scope.checkoutForm = {};
            $scope.checkoutForm.paymentForm ={};
            $scope.checkoutForm.paymentForm.ccNumber = {};
            $scope.checkoutForm.paymentForm.ccNumber.$setValidity = setValidityMock;
            $scope.checkoutForm.paymentForm.ccNumber.msg = 'Bad Error';
            $scope.resetErrorMsg($scope.checkoutForm.paymentForm.ccNumber);
        });

        it('should reset the submission message', function(){
            expect($scope.message).toBeFalsy();
        });

        it('should reset the field error message', function(){
            expect($scope.checkoutForm.paymentForm.ccNumber.msg).toBeFalsy();
        });

        it('should reset validity of the field', function(){
            expect(setValidityMock).toHaveBeenCalledWith('validation',true);
        });
    });

});

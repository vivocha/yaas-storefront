// var fs = require('fs');
// var tu = require('./protractor-utils.js');


//       function writeHtml(data, filename) {
//            var stream = fs.createWriteStream(filename);

//            stream.write(new Buffer(data, 'utf8'));
//            stream.end();
//       }

//       function writeScreenShot(data, filename) {
//            var stream = fs.createWriteStream(filename);

//            stream.write(new Buffer(data, 'base64'));
//            stream.end();
//        }

// describe("cart:", function () {



//    describe("verify cart functionality", function () {

//      beforeEach(function () {
//          // ENSURE WE'RE TESTING AGAINST THE FULL SCREEN VERSION
//        browser.driver.manage().window().maximize();
//        browser.manage().deleteAllCookies();
//        browser.get(tu.tenant + '/#!/products');
//        browser.sleep(8000);
//      });


//        iit('should load one product into cart', function () {
//          tu.clickElement('id', tu.cartButtonId);
//          browser.sleep(250);
//          expect(element(by.xpath("//div[@id='cart']/div[2]")).getText()).toEqual('YOUR CART IS EMPTY');
//          tu.clickElement('xpath', tu.contineShopping);
//          tu.clickElement('xpath', tu.whiteCoffeeMug);
//          browser.sleep(1000);
//          tu.clickElement('id', tu.buyButton);
//          browser.sleep(250);
//          tu.verifyCartAmount("1");
//          tu.verifyCartTotal("$10.67");
//          tu.clickElement('xpath', tu.removeFromCart);
//         browser.sleep(1000);
//          expect(element(by.xpath("//div[@id='cart']/div[2]")).getText()).toEqual('YOUR CART IS EMPTY');

//        });

//          it('should load multiple products into cart', function () {
//            tu.clickElement('id', tu.cartButtonId);
//            browser.sleep(250);
//            expect(element(by.xpath("//div[@id='cart']/div[2]")).getText()).toEqual('YOUR CART IS EMPTY');
//            tu.clickElement('xpath', tu.contineShopping);
//            browser.sleep(250);
//            tu.clickElement('xpath', tu.whiteCoffeeMug);
//            browser.sleep(1000);
//            tu.clickElement('id', tu.buyButton);
//            browser.sleep(3000);
//            tu.verifyCartAmount("1");
//            browser.sleep(1000);
//            tu.verifyCartTotal("$10.67");
//            tu.clickElement('xpath', tu.contineShopping);
//            browser.sleep(500);
//            tu.clickElement('css', 'img');
//            browser.sleep(250);
//            tu.clickElement('xpath', tu.whiteThermos);
//            tu.clickElement('id', tu.buyButton);
//            browser.sleep(1000);
//            tu.verifyCartTotal("$24.65");

//          });

 
//         //once cart bugs are fixed add multiple products to this test 10/3
//          it('should update quantity', function () {
//            tu.clickElement('id', tu.cartButtonId);
//            browser.sleep(250);
//            expect(element(by.xpath("//div[@id='cart']/div[2]")).getText()).toEqual('YOUR CART IS EMPTY');
//            tu.clickElement('xpath', tu.contineShopping);
//            browser.sleep(250);
//            tu.clickElement('xpath', tu.whiteCoffeeMug);
//            browser.sleep(1000);
//            tu.clickElement('id', tu.buyButton);
//            browser.sleep(250);
//            tu.verifyCartAmount("1");
//            browser.sleep(1000);
//            tu.verifyCartTotal("$10.67");
//            tu.clickElement('xpath', tu.contineShopping);
//            browser.sleep(250);
//            tu.clickElement('id', tu.buyButton);
//            browser.sleep(3000);
//            tu.verifyCartAmount('2');
//            browser.sleep(1000);
//            tu.verifyCartTotal('$21.34');
//            tu.sendKeysByXpath(tu.cartQuantity, '5');
//            browser.sleep(1000);
//            tu.verifyCartAmount("5");
//            tu.verifyCartTotal("$53.35");
//            tu.sendKeysByXpath(tu.cartQuantity, '10');
//            browser.sleep(1000);
//            tu.verifyCartAmount("10");
//            tu.verifyCartTotal("$106.70");
//          });

//          it('should not add out of stock item', function () {
//            tu.clickElement('id', tu.cartButtonId);
//            browser.sleep(250);
//             expect(element(by.xpath("//div[@id='cart']/div[2]")).getText()).toEqual('YOUR CART IS EMPTY');
//            tu.clickElement('xpath', tu.contineShopping);
//            tu.clickElement('xpath', tu.blackCoffeeMug);
//            tu.clickElement('xpath', tu.outOfStockButton);
//            tu.clickElement('id',tu.cartButtonId);
//            browser.sleep(250);
//             expect(element(by.xpath("//div[@id='cart']/div[2]")).getText()).toEqual('YOUR CART IS EMPTY');
//            tu.clickElement('xpath', tu.contineShopping);
//          });

//          it('should not allow negative numbers', function () {
//           tu.clickElement('id', tu.cartButtonId);
//           browser.sleep(250);
//          expect(element(by.xpath("//div[@id='cart']/div[2]")).getText()).toEqual('YOUR CART IS EMPTY');
//           tu.clickElement('xpath', tu.contineShopping);
//           tu.clickElement('xpath', tu.whiteCoffeeMug);
//           browser.sleep(1000);
//           tu.clickElement('id', tu.buyButton); 
//           browser.sleep(250);
//           tu.verifyCartTotal("$10.67");
//           tu.sendKeysByXpath(tu.cartQuantity, '-5');
//           tu.verifyCartAmount('5');
//           browser.sleep(250);
//           tu.verifyCartTotal('$53.35');
//           tu.sendKeysByXpath(tu.cartQuantity, 'it should not accept alpha');
//           tu.verifyCartAmount('');
//           tu.verifyCartTotal('$53.35');
//          });

//    });
// });


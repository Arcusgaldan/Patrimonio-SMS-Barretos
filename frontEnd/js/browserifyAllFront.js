(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
var fs = require('fs');

fs.readdir('./', function(err, items) {
    //console.log(items);
 
    for (var i=0; i<items.length; i++) {
    	if(!items[i].match("^.*\.js.*$"))
    		continue;
    	
    	if(!items[i].match("^.*Front.*$")){
    		console.log(items[i] + " não tem Front");
    		var exec = require('child_process').execSync;

    		var comando = "browserify -o " + items[i].substring(0, items[i].length - 3) + "Front.js " + items[i];
    		console.log("Comando: " + comando);

    		exec(comando);
    	}
    }
});
},{"child_process":1,"fs":1}]},{},[2]);

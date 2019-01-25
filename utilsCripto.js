module.exports = {
	criptoAES: function(chave, msg){
		let aes = require('aes-js');
		let textoBytes = aes.utils.utf8.toBytes(msg);

		var aesCtr = new aes.ModeOfOperation.ctr(chave, new aes.Counter());
		var bytesCriptografados = aesCtr.encrypt(textoBytes);

		var hexCriptografado = aes.utils.hex.fromBytes(bytesCriptografados);
		return hexCriptografado;
	},

	descriptoAES: function(chave, msg){
		let aes = require('aes-js');		
		bytesCriptografados = aes.utils.hex.toBytes(msg);
		var aesCtr = new aes.ModeOfOperation.ctr(chave, new aes.Counter());

		var bytesDescriptografados = aesCtr.decrypt(bytesCriptografados);
		var textoDescriptografado = aes.utils.utf8.fromBytes(bytesDescriptografados);
		return textoDescriptografado;
	},

	criptoRSA: function(msg){
		let rsa = require('node-rsa');
		let publicKey = "-----BEGIN PUBLIC KEY-----"+
		"MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCFSZes81wmDnhSPbNVOf4atc/X"+
		"YMDeVn9KLgGxRrzF2i8ce68uxWTWbKZsAi4ChV5XFCFB+MMLIFdBEFxBbupva5BK"+
		"fxm9M66SJ5YKvDf5lGhyw7yFt343YnI1Ayy/CP5hroVRBLlILNgSNvjWfEwFUEB2"+
		"+CHElmLRQxvS/+PTEQIDAQAB"+
		"-----END PUBLIC KEY-----";

		var key = new rsa();
		key.importKey(publicKey, 'pkcs1-public');
		let msgCripto = key.encrypt(msg, 'hex');

		return msgCripto;
	},

	descriptoRSA: function(msg){
		let rsa = require('node-rsa');
		let privateKey = require('fs').readFileSync('./privateRSA.txt');

		var key = new rsa();
		key.importKey(privateKey, 'pkcs1-private');
		let msgFinal = key.decrypt(msg);
		return msgFinal;
	}
};
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
		let publicKey = "-----BEGIN RSA PUBLIC KEY-----\n"+
		"MIIBCgKCAQEAoHvzrCdqxoqWwxiEFgdfJ+JYYIpS5jmVVercqK2oXpCT3OuuBvGq\n"+
		"FRgyHXD1fgwCLqHBIfT+SP+faVgEiVl1WDfDW7gqkX5y4ko/+naYR8UNe10xBXpv\n"+
		"x96SXyOH23GlsduiztOfZkX1FkqFbobMEpvq8orExZTzY20ceMVWyxtWVNxX5+6z\n"+
		"y6qCJXBFYoucF2O8qHMRrSj8dnYkEA/0tK0UplkEcyXt9OJpxI092Z46C2cKjs8P\n"+
		"5SXF7gpd3xpQApuHT7lTbI6Di7aRjF2QppEGC9I6GotxWNifqa0/NgbbwqJSAo55\n"+
		"DxbZrqVgOGVR5zvS7vNM70VIpk4UmGrP8wIDAQAB\n"+
		"-----END RSA PUBLIC KEY-----";

		var key = new rsa();
		key.importKey(publicKey, 'pkcs1-public');
		let msgCripto = key.encrypt(msg, 'hex');

		return msgCripto;
	}
};
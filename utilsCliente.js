module.exports = {
	senhaHash: function(senha){
		var crypto = require('crypto');
    	var hash = crypto.createHash('sha256');

	    if(senha == null)
	        return "";

	    hash.update(senha);
	    var retorno = hash.digest('hex');
	    return retorno;
	},

	opcoesHTTP: function(texto){
		var retorno = {
			hostname: "localhost",
		    port: 8080,
		    //mode: 'no-cors',
		    //Access-Control-Allow-Origin: "http://localhost",
		    method: 'POST',
		    headers: {
		      'Content-Type': 'text/plain',    
		      'Content-Length': Buffer.byteLength(texto),
		      // 'Objeto': null,
		      // 'Operacao': null,
		      'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin, Origin, X-Requested-With, Content-Type, Accept, Objeto, Operacao',
		      'Access-Control-Allow-Origin': 'localhost',
		      'Access-Control-Allow-Credentials': true,
		      'Access-Control-Allow-Methods': 'OPTION, GET, POST'
	    	}
	    };
		return retorno;
	},

	enviaRequisicao: function(objeto, operacao, dados, cb){
		var http = require('http');
		var opcoesHTTP;
		var texto;
		
		if(dados == ""){			
			opcoesHTTP = this.opcoesHTTP("");
			texto = "";
		}else{
			texto = JSON.stringify(dados);
			opcoesHTTP = this.opcoesHTTP(texto);
		}

		opcoesHTTP.headers.Objeto = objeto;
		opcoesHTTP.headers.Operacao = operacao;

		var req = http.request(opcoesHTTP, (res) => {
			cb(res);
		});

		if(texto != ""){
			req.write(texto);
		}
		req.end();
	}
};
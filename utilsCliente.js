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
			hostname: "172.17.17.15",
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
	},

	enumOperador: function(cod){
		switch(cod){
			case '0':
				return '=';
			case '1':
				return '<>';
			case '2':
				return '<';
			case '3':
				return '<=';
			case '4':
				return '>';
			case '5':
				return '>=';
			default:
				return '';
		}
	},

	completaZero: function (valor, qtd){
		valor += "";
		let resultado = valor;
		while(resultado.length < qtd){
			resultado = "0" + resultado;
		}
		return resultado;
	},

	formataData: function(data){
		if(!data){
			return "-";
		}
		// var separado = data.substring(0, 10).split('-');
		// var resultado = separado[2] + "/" + separado[1] + "/" + separado[0];

		let d = new Date(data);
		let resultado = this.completaZero(d.getDate(), 2) + "/" + this.completaZero(d.getMonth() + 1, 2) + "/" + this.completaZero(d.getFullYear(), 4);
		return resultado;
	},

	formataDataHora: function(data){
		if(!data){
			return "-";
		}

		// var diaMes = data.substring(0, 10);
		// var hora = data.substring(11, 19);
		// var separado = diaMes.split('-');
		// var resultado = separado[2] + "/" + separado[1] + "/" + separado[0] + " " + hora;

		let d = new Date(data);
		let resultado = this.completaZero(d.getDate(), 2) + "/" + this.completaZero(d.getMonth() + 1, 2) + "/" + this.completaZero(d.getFullYear(), 4) + " " + this.completaZero(d.getHours(), 2) + ":" + this.completaZero(d.getMinutes(), 2) + ":" + this.completaZero(d.getSeconds(), 2);
		return resultado;
	},

	fomataDataISO: function(data){
		if(!data){
			return "-";
		}
		// var separado = data.substring(0, 10).split('-');
		// var resultado = separado[2] + "/" + separado[1] + "/" + separado[0];

		let d = new Date(data);
		let resultado = this.completaZero(d.getFullYear(), 4) + "-" + this.completaZero(d.getMonth() + 1, 2) + "-" + this.completaZero(d.getDate(), 2);
		return resultado;
	},

	formataDataHoraISO: function(data){
		if(!data){
			return "-";
		}

		// var diaMes = data.substring(0, 10);
		// var hora = data.substring(11, 19);
		// var separado = diaMes.split('-');
		// var resultado = separado[2] + "/" + separado[1] + "/" + separado[0] + " " + hora;

		let d = new Date(data);
		let resultado = this.completaZero(d.getFullYear(), 4) + "-" + this.completaZero(d.getMonth() + 1, 2) + "-" + this.completaZero(d.getDate(), 2) + "T" + this.completaZero(d.getHours(), 2) + ":" + this.completaZero(d.getMinutes(), 2) + ":" + this.completaZero(d.getSeconds(), 2);
		//console.log("Em formataDataHoraISO, data = " + data + " e resultado = " + resultado);
		return resultado;
	},

	comparaData: function(a, b){//
		a = a.split('-');
		b = b.split('-');

		if(parseInt(a[0]) < parseInt(b[0])){
			return -1;
		}else if(parseInt(a[0]) > parseInt(b[0])){
			return 1;
		}else{
			if(parseInt(a[1]) < parseInt(b[1])){
				return -1;
			}else if(parseInt(a[1]) > parseInt(b[1])){
				return 1;
			}else{
				if(parseInt(a[2]) < parseInt(b[2])){
					return -1;
				}else if(parseInt(a[2]) > parseInt(b[2])){
					return 1;
				}else{
					return 0;
				}
			}
		}
	}
};
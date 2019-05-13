module.exports = {
	trataOperacao: function(usuario, operacao, msg, cb){ //Encaminha a execução para a operação passada pelo servidor (esta função também é responsável por fazer o controle de acesso às funções restritas apenas a usuários logados)
		var resposta = {};
		switch(operacao){
			case 'DATA':
				resposta.codigo = 200;
				resposta.msg = this.dataAtual();
				cb(resposta);
				break;

			case 'DATAHORA':			
				resposta.codigo = 200;
				resposta.msg = this.dataHoraAtual();
				cb(resposta);
				break;

			case 'DATAEXTENSO':
				resposta.codigo = 200;
				resposta.msg = this.dataExtenso();
				cb(resposta);
				break;
		}			
	},

	completaZero: function(tam, data){
		data += "";
		while(data.length < tam){
			data = "0" + data;
		}
		return data;
	},

	mesExtenso: function(numMes){
		numMes++;
		switch(numMes){
			case 1:
				return "janeiro";
			case 2:
				return "fevereiro";
			case 3:
				return "março";
			case 4:
				return "abril";
			case 5:
				return "maio";
			case 6:
				return "junho";
			case 7:
				return "julho";
			case 8:
				return "agosto";
			case 9:
				return "setembro";
			case 10:
				return "outubro";
			case 11:
				return "novembro";
			case 12:
				return "dezembro";
			default:
				return "";
		}
	},

	dataAtual: function(){
		var d = new Date();
		var data = "" + d.getFullYear() + "-" + this.completaZero(2, (d.getMonth() + 1)) + "-" + this.completaZero(2, d.getDate());
		return data;
	},

	dataHoraAtual: function(){
		var d = new Date();
		var data = "" + d.getFullYear() + "-" + this.completaZero(2, (d.getMonth() + 1)) + "-" + this.completaZero(2, d.getDate()) + " " + this.completaZero(2, d.getHours()) + ":" + this.completaZero(2, d.getMinutes()) + ":" + this.completaZero(2, d.getSeconds());
		return data;
	},

	dataExtenso: function(){
		var d = new Date();
		var mesExtenso = this.mesExtenso(d.getMonth());
		if(mesExtenso == "")
			return;
		var data = "" + this.completaZero(2, d.getDate()) + " de " + mesExtenso + " de " + this.completaZero(4, d.getFullYear());
		return data;
	}

}
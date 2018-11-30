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
		}			
	},

	completaZero: function(tam, data){
		data += "";
		while(data.length < tam){
			data = "0" + data;
		}
		return data;
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
	}

}
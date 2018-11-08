module.exports = {
	trataOperacao: function(permissao, operacao, msg, cb){ //Encaminha a execução para a operação passada pelo servidor (esta função também é responsável por fazer o controle de acesso às funções restritas apenas a usuários logados)
		var resposta = {};
		switch(operacao){
			case 'INSERIR':
				this.inserir(msg, function(codRes){
					resposta.codigo = codRes;
					cb(resposta);
				});
				break;
			case 'ALTERAR':
				this.alterar(msg, function(codRes){
					resposta.codigo = codRes;
					cb(resposta);
				});
				break;
			case 'EXCLUIR':
				this.excluir(msg, function(codRes){
					resposta.codigo = codRes;
					cb(resposta);
				});
				break;
			case 'LISTAR':
				this.listar(function(res){
					if(res){
						resposta.codigo = 200;
						resposta.msg = JSON.stringify(res);
					}else{
						resposta.codigo = 400;
					}
					cb(resposta);
				});
				break;
			case 'BUSCAR':
				this.buscar(msg, function(res){
					if(res){
						resposta.codigo = 200;
						resposta.msg = JSON.stringify(res);
					}else{
						resposta.codigo = 400;
					}
					cb(resposta);
				});
				break;
			default:
				cb(410);
		}
	},

	validar: function(computador){ //Valida os campos necessários em seu formato ideal
		if(!computador){
			return false;
		}

		var validates = require('./../validates.js');

		if(!validates.req(computador.id) || !validates.req(computador.codItem) || !validates.req(computador.reserva) || !validates.req(computador.aposentado)){
			return false;
		}else{
			return true;
		}
	},

	inserir: function(computador, cb){ //Insere as informações passadas pelo servidor
		if(!this.validar(computador)){ //Se os dados não forem válidos, para a execução e retorna código de erro
			cb(400);
			return;
		}
		require('./controller.js').inserir("TBComputador", computador, function(codRes){
			cb(codRes);
		});
	},

	alterar: function(computador, cb){ //Altera as informações passadas por servidor
		if(!this.validar(computador)){ //Se os dados não forem válidos, para a execução e retorna código de erro
			cb(400);
			return;
		}

		require('./controller.js').alterar("TBComputador", computador, function(codRes){
			cb(codRes);
		});
	},

	excluir: function(computador, cb){ //Exclui o registro cujo ID seja igual o ID fornecido pelo servidor
		if(!computador)
			cb(400);
		else if(!computador.id)
			cb(400);
		require('./controller.js').excluir("TBComputador", computador, function(codRes){
			cb(codRes);
		});
	},

	listar: function(cb){ //Lista todos os registros da tabela;
		require('./controller.js').listar("TBComputador", function(res){
			cb(res);
		});
	},

	buscar: function(argumentos, cb){ //Busca registros na tabela baseado nos argumentos recebidos pelo servidor
		require('./controller.js').buscar("TBComputador", argumentos, function(res){
			cb(res);
		});		
	}
}
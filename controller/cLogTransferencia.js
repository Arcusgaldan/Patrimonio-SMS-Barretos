module.exports = {
	trataOperacao: function(usuario, operacao, msg, cb){ //Encaminha a execução para a operação passada pelo servidor (esta função também é responsável por fazer o controle de acesso às funções restritas apenas a usuários logados)
		var resposta = {};
		switch(operacao){
			case 'INSERIR':
				if(!usuario){
					resposta.codigo = 413;
					cb(resposta);
				}
				this.inserir(msg, function(codRes){
					resposta.codigo = codRes;
					cb(resposta);
				});
				break;
			case 'ALTERAR':
				if(!usuario){
					resposta.codigo = 413;
					cb(resposta);
				}
				this.alterar(msg, function(codRes){
					resposta.codigo = codRes;
					cb(resposta);
				});
				break;
			case 'EXCLUIR':
				if(!usuario){
					resposta.codigo = 413;
					cb(resposta);
				}
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

	validar: function(logTransferencia){ //Valida os campos necessários em seu formato ideal
		if(!logTransferencia){
			return false;
		}

		var validates = require('./../validates.js');

		if(!validates.req(logTransferencia.id) || !validates.dataHora(logTransferencia.data)){
			return false;
		}else{
			return true;
		}
	},

	inserir: function(logTransferencia, cb){ //Insere as informações passadas pelo servidor
		if(!this.validar(logTransferencia)){ //Se os dados não forem válidos, para a execução e retorna código de erro
			cb(412);
			return;
		}
		require('./controller.js').inserir("LogTransferencia", logTransferencia, function(codRes){
			cb(codRes);
		});
	},

	alterar: function(logTransferencia, cb){ //Altera as informações passadas por servidor
		if(!this.validar(logTransferencia)){ //Se os dados não forem válidos, para a execução e retorna código de erro
			cb(412);
			return;
		}

		require('./controller.js').alterar("LogTransferencia", logTransferencia, function(codRes){
			cb(codRes);
		});
	},

	excluir: function(logTransferencia, cb){ //Exclui o registro cujo ID seja igual o ID fornecido pelo servidor
		if(!logTransferencia)
			cb(412);
		else if(!logTransferencia.id)
			cb(412);
		require('./controller.js').excluir("LogTransferencia", logTransferencia, function(codRes){
			cb(codRes);
		});
	},

	listar: function(cb){ //Lista todos os registros da tabela;
		require('./controller.js').listar("LogTransferencia", function(res){
			cb(res);
		});
	},

	buscar: function(argumentos, cb){ //Busca registros na tabela baseado nos argumentos recebidos pelo servidor
		require('./controller.js').buscar("LogTransferencia", argumentos, function(res){
			cb(res);
		});		
	}
}
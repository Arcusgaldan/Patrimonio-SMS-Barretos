module.exports = {
	trataOperacao: function(usuario, operacao, msg, cb){ //Encaminha a execução para a operação passada pelo servidor (esta função também é responsável por fazer o controle de acesso às funções restritas apenas a usuários logados)
		var resposta = {};
		switch(operacao){
				if(!usuario){
					resposta.codigo = 413;
					cb(resposta);
				}
			case 'INSERIR':
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

	validar: function(tipoItem){ //Valida os campos necessários em seu formato ideal
		if(!tipoItem){
			return false;
		}

		var validates = require('./../validates.js');

		if(!validates.req(tipoItem.id) || !validates.req(tipoItem.nome)){
			return false;
		}else{
			return true;
		}
	},

	inserir: function(tipoItem, cb){ //Insere as informações passadas pelo servidor
		if(!this.validar(tipoItem)){ //Se os dados não forem válidos, para a execução e retorna código de erro
			cb(412);
			return;
		}
		require('./controller.js').inserir("TipoItem", tipoItem, function(codRes){
			cb(codRes);
		});
	},

	alterar: function(tipoItem, cb){ //Altera as informações passadas por servidor
		if(!this.validar(tipoItem)){ //Se os dados não forem válidos, para a execução e retorna código de erro
			cb(412);
			return;
		}

		require('./controller.js').alterar("TipoItem", tipoItem, function(codRes){
			cb(codRes);
		});
	},

	excluir: function(tipoItem, cb){ //Exclui o registro cujo ID seja igual o ID fornecido pelo servidor
		if(!tipoItem)
			cb(412);
		else if(!tipoItem.id)
			cb(412);
		require('./controller.js').excluir("TipoItem", tipoItem, function(codRes){
			cb(codRes);
		});
	},

	listar: function(cb){ //Lista todos os registros da tabela;
		require('./controller.js').listar("TipoItem", function(res){
			cb(res);
		});
	},

	buscar: function(argumentos, cb){ //Busca registros na tabela baseado nos argumentos recebidos pelo servidor
		require('./controller.js').buscar("TipoItem", argumentos, function(res){
			cb(res);
		});		
	}
}
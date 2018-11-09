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

	validar: function(setor){ //Valida os campos necessários em seu formato ideal
		if(!setor){
			return false;
		}

		var validates = require('./../validates.js');

		if(!validates.req(setor.id) || !validates.req(setor.nome) || !validates.req(setor.local)){
			return false;
		}else{
			return true;
		}
	},

	inserir: function(setor, cb){ //Insere as informações passadas pelo servidor
		if(!this.validar(setor)){ //Se os dados não forem válidos, para a execução e retorna código de erro
			cb(400);
			return;
		}
		require('./controller.js').inserir("Setor", setor, function(codRes){
			cb(codRes);
		});
	},

	alterar: function(setor, cb){ //Altera as informações passadas por servidor
		if(!this.validar(setor)){ //Se os dados não forem válidos, para a execução e retorna código de erro
			cb(400);
			return;
		}

		require('./controller.js').alterar("Setor", setor, function(codRes){
			cb(codRes);
		});
	},

	excluir: function(setor, cb){ //Exclui o registro cujo ID seja igual o ID fornecido pelo servidor
		if(!setor)
			cb(400);
		else if(!setor.id)
			cb(400);
		require('./controller.js').excluir("Setor", setor, function(codRes){
			cb(codRes);
		});
	},

	listar: function(cb){ //Lista todos os registros da tabela;
		require('./controller.js').listar("Setor", function(res){
			cb(res);
		});
	},

	buscar: function(argumentos, cb){ //Busca registros na tabela baseado nos argumentos recebidos pelo servidor
		require('./controller.js').buscar("Setor", argumentos, function(res){
			cb(res);
		});		
	}
}
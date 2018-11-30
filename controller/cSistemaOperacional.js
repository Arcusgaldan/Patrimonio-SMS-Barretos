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

	validar: function(sistemaOperacional){ //Valida os campos necessários em seu formato ideal
		if(!sistemaOperacional){
			return false;
		}

		var validates = require('./../validates.js');

		if(!validates.req(sistemaOperacional.id) || !validates.req(sistemaOperacional.nome)){
			return false;
		}else{
			return true;
		}
	},

	inserir: function(sistemaOperacional, cb){ //Insere as informações passadas pelo servidor
		if(!this.validar(sistemaOperacional)){ //Se os dados não forem válidos, para a execução e retorna código de erro
			cb(412);
			return;
		}
		require('./controller.js').inserir("SistemaOperacional", sistemaOperacional, function(codRes){
			cb(codRes);
		});
	},

	alterar: function(sistemaOperacional, cb){ //Altera as informações passadas por servidor
		if(!this.validar(sistemaOperacional)){ //Se os dados não forem válidos, para a execução e retorna código de erro
			cb(412);
			return;
		}

		require('./controller.js').alterar("SistemaOperacional", sistemaOperacional, function(codRes){
			cb(codRes);
		});
	},

	excluir: function(sistemaOperacional, cb){ //Exclui o registro cujo ID seja igual o ID fornecido pelo servidor
		if(!sistemaOperacional)
			cb(412);
		else if(!sistemaOperacional.id)
			cb(412);
		require('./controller.js').excluir("SistemaOperacional", sistemaOperacional, function(codRes){
			cb(codRes);
		});
	},

	listar: function(cb){ //Lista todos os registros da tabela;
		require('./controller.js').listar("SistemaOperacional", function(res){
			cb(res);
		});
	},

	buscar: function(argumentos, cb){ //Busca registros na tabela baseado nos argumentos recebidos pelo servidor
		require('./controller.js').buscar("SistemaOperacional", argumentos, function(res){
			cb(res);
		});		
	}
}
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

	validar: function(usuario){ //Valida os campos necessários em seu formato ideal
		if(!usuario){
			return false;
		}

		var validates = require('./../validates.js');

		if(!validates.req(usuario.id) || !validates.req(usuario.nome) || !validates.req(usuario.email) || !validates.exact(usuario.cpf, 14) || 
			!validates.exact(usuario.senha, 64)){
			return false;
		}else{
			return true;
		}
	},

	inserir: function(usuario, cb){ //Insere as informações passadas pelo servidor
		if(!this.validar(usuario)){ //Se os dados não forem válidos, para a execução e retorna código de erro
			cb(400);
			return;
		}
		require('./controller.js').inserir("Usuario", usuario, function(codRes){
			cb(codRes);
		});
	},

	alterar: function(usuario, cb){ //Altera as informações passadas por servidor
		if(!this.validar(usuario)){ //Se os dados não forem válidos, para a execução e retorna código de erro
			cb(400);
			return;
		}

		require('./controller.js').alterar("Usuario", usuario, function(codRes){
			cb(codRes);
		});
	},

	excluir: function(usuario, cb){ //Exclui o registro cujo ID seja igual o ID fornecido pelo servidor
		if(!usuario)
			cb(400);
		else if(!usuario.id)
			cb(400);
		require('./controller.js').excluir("Usuario", usuario, function(codRes){
			cb(codRes);
		});
	},

	listar: function(cb){ //Lista todos os registros da tabela;
		require('./controller.js').listar("Usuario", function(res){
			cb(res);
		});
	},

	buscar: function(argumentos, cb){ //Busca registros na tabela baseado nos argumentos recebidos pelo servidor
		require('./controller.js').buscar("Usuario", argumentos, function(res){
			cb(res);
		});		
	}
}
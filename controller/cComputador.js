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
				resposta.codigo = 410;
				cb(resposta);
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
			cb(412);
			return;
		}
		require('./controller.js').inserir("Computador", computador, function(codRes){
			cb(codRes);
		});
	},

	alterar: function(computador, cb){ //Altera as informações passadas por servidor
		if(!this.validar(computador)){ //Se os dados não forem válidos, para a execução e retorna código de erro
			cb(412);
			return;
		}

		require('./controller.js').alterar("Computador", computador, function(codRes){
			cb(codRes);
		});
	},

	excluir: function(computador, cb){ //Exclui o registro cujo ID seja igual o ID fornecido pelo servidor
		if(!computador)
			cb(412);
		else if(!computador.id)
			cb(412);
		require('./controller.js').excluir("Computador", computador, function(codRes){
			cb(codRes);
		});
	},

	listar: function(cb){ //Lista todos os registros da tabela;
		require('./controller.js').listar("Computador", function(res){
			cb(res);
		}, {campos: "TBComputador.*, p.nome processadorNome, so.nome sistemaNome, i.patrimonio itemPatrimonio, s.nome setorNome, s.local setorLocal, s.id setorId", 
		joins: [
			{tabela: "TBProcessador p", on: "p.id = TBComputador.codProcessador", tipo: "LEFT"}, 
			{tabela: "TBSistemaOperacional so", on: "so.id = TBComputador.codSO", tipo: "LEFT"}, 
			{tabela: "TBItem i", on: "i.id = TBComputador.codItem"}, 
			{tabela: "TBLogTransferencia lt", on: "lt.codItem = i.id"}, 
			{tabela: "TBSetor s", on: "s.id = lt.codSetor"}
		], 
		where: "lt.atual = 1", orderBy: [{campo: "i.patrimonio", sentido: "asc"}]});
	},

	buscar: function(argumentos, cb){ //Busca registros na tabela baseado nos argumentos recebidos pelo servidor
		require('./controller.js').buscar("Computador", argumentos, function(res){
			cb(res);
		});		
	}
}
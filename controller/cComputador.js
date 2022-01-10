module.exports = {
	trataOperacao: function(usuario, operacao, msg, cb){ //Encaminha a execução para a operação passada pelo servidor (esta função também é responsável por fazer o controle de acesso às funções restritas apenas a usuários logados)
		console.log("Entrando no switch do cComputador::trataOperacao");
		var resposta = {};
		switch(operacao){
			case 'INSERIR':
				if(!usuario){
					resposta.codigo = 413;
					cb(resposta);
				}
				this.inserir(msg, function(codRes){
					resposta.codigo = codRes;
					if(resposta.codigo == 200){
						require('./controller.js').proximoID("Computador", function(id){						
							msg.id = parseInt(id) - 1;
							let log = {
								id: 0,
								chave: parseInt(id) - 1,
								tabela: "TBComputador",
								operacao: "INSERIR",
								mudanca: JSON.stringify(msg),
								data: require('./cData.js').dataHoraAtual(),
								codUsuario: usuario.id
							}

							require('./cLog.js').inserir(log, function(codRes){
								if(codRes == 200){
									cb(resposta);	
									return;																
								}else{
									resposta.codigo = 416;
									cb(resposta);
									return;
								}
							});
						});
					}else{
						cb(resposta);
						return;
					}
				});
				break;
			case 'ALTERAR':
				if(!usuario){
					resposta.codigo = 413;
					cb(resposta);
				}
				this.alterar(msg, function(codRes){
					resposta.codigo = codRes;
					if(resposta.codigo == 200){
						let log = {
							id: 0,
							chave: msg.id,
							tabela: "TBComputador",
							operacao: "ALTERAR",
							mudanca: JSON.stringify(msg),
							data: require('./cData.js').dataHoraAtual(),
							codUsuario: usuario.id
						}
						require('./cLog.js').inserir(log, function(codRes){
							if(codRes == 200){
								cb(resposta);	
								return;																
							}else{
								resposta.codigo = 416;
								cb(resposta);
								return;
							}
						});
					}else{
						cb(resposta);
						return;
					}
				});
				break;
			case 'EXCLUIR':
				if(!usuario){
					resposta.codigo = 413;
					cb(resposta);
				}
				this.excluir(msg, function(codRes){
					resposta.codigo = codRes;
					if(resposta.codigo == 200){
						let log = {
							id: 0,
							chave: msg.id,
							tabela: "TBComputador",
							operacao: "EXCLUIR",
							mudanca: '-',
							data: require('./cData.js').dataHoraAtual(),
							codUsuario: usuario.id
						}
						require('./cLog.js').inserir(log, function(codRes){
							if(codRes == 200){
								cb(resposta);		
								return;															
							}else{
								resposta.codigo = 416;
								cb(resposta);
								return;
							}
						});
					}else{
						cb(resposta);
						return;
					}
				});
				break;
			case 'LISTAR':
				console.log("Entrei no case de listar em cComputador::trataOperacao");
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
		console.log("Entrei em cComputador::listar");
		require('./controller.js').listar("Computador", function(res){
			cb(res);
		}, {campos: "TBComputador.*, p.nome processadorNome, so.nome sistemaNome, i.patrimonio itemPatrimonio, i.ativo ativo, i.id itemId, s.nome setorNome, l.nome localNome, s.id setorId, l.id localId", 
		joins: [
			{tabela: "TBProcessador p", on: "p.id = TBComputador.codProcessador", tipo: "LEFT"}, 
			{tabela: "TBSistemaOperacional so", on: "so.id = TBComputador.codSO", tipo: "LEFT"}, 
			{tabela: "TBItem i", on: "i.id = TBComputador.codItem"}, 
			{tabela: "TBLogTransferencia lt", on: "lt.codItem = i.id"}, 
			{tabela: "TBSetor s", on: "s.id = lt.codSetor", tipo: "LEFT"},
			{tabela: "TBLocal l", on: "l.id = lt.codLocal"}
		], 
		where: "lt.atual = 1", orderBy: [{campo: "i.patrimonio", sentido: "asc"}]});
	},

	buscar: function(argumentos, cb){ //Busca registros na tabela baseado nos argumentos recebidos pelo servidor
		require('./controller.js').buscar("Computador", argumentos, function(res){
			cb(res);
		});		
	}
}
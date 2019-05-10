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
					if(resposta.codigo == 200){
						require('./controller.js').proximoID("DiscoBackup", function(id){						
							msg.id = parseInt(id) - 1;
							let log = {
								id: 0,
								chave: parseInt(id) - 1,
								tabela: "TBDiscoBackup",
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
							tabela: "TBDiscoBackup",
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
							tabela: "TBDiscoBackup",
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

	validar: function(discoBackup){ //Valida os campos necessários em seu formato ideal
		if(!discoBackup){
			return false;
		}

		var validates = require('./../validates.js');

		if(!validates.req(discoBackup.id) || !validates.req(discoBackup.nome) || !validates.req(discoBackup.local) || !validates.req(discoBackup.tamanho)){
			return false;
		}else{
			return true;
		}
	},

	inserir: function(discoBackup, cb){ //Insere as informações passadas pelo servidor
		if(!this.validar(discoBackup)){ //Se os dados não forem válidos, para a execução e retorna código de erro
			cb(412);
			return;
		}
		require('./controller.js').inserir("DiscoBackup", discoBackup, function(codRes){
			cb(codRes);
		});
	},

	alterar: function(discoBackup, cb){ //Altera as informações passadas por servidor
		if(!this.validar(discoBackup)){ //Se os dados não forem válidos, para a execução e retorna código de erro
			cb(412);
			return;
		}

		require('./controller.js').alterar("DiscoBackup", discoBackup, function(codRes){
			cb(codRes);
		});
	},

	excluir: function(discoBackup, cb){ //Exclui o registro cujo ID seja igual o ID fornecido pelo servidor
		if(!discoBackup)
			cb(412);
		else if(!discoBackup.id)
			cb(412);
		require('./controller.js').excluir("DiscoBackup", discoBackup, function(codRes){
			cb(codRes);
		});
	},

	listar: function(cb){ //Lista todos os registros da tabela;
		require('./controller.js').listar("DiscoBackup", function(res){
			cb(res);
		}, {orderBy: [{campo: "nome", sentido: "asc"}]});
	},

	buscar: function(argumentos, cb){ //Busca registros na tabela baseado nos argumentos recebidos pelo servidor
		require('./controller.js').buscar("DiscoBackup", argumentos, function(res){
			cb(res);
		});		
	}
}
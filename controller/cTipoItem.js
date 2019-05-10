module.exports = {
	trataOperacao: function(usuario, operacao, msg, cb){ //Encaminha a execução para a operação passada pelo servidor (esta função também é responsável por fazer o controle de acesso às funções restritas apenas a usuários logados)
		var resposta = {};
		switch(operacao){
			case 'INSERIR':
				if(!usuario){
					resposta.codigo = 413;
					if(resposta.codigo == 200){
						require('./controller.js').proximoID("TipoItem", function(id){						
							msg.id = parseInt(id) - 1;
							let log = {
								id: 0,
								chave: parseInt(id) - 1,
								tabela: "TBTipoItem",
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
				}
				this.inserir(msg, function(codRes){
					resposta.codigo = codRes;
					cb(resposta);
				});
				break;
			case 'ALTERAR':
				if(!usuario){
					resposta.codigo = 413;
					if(resposta.codigo == 200){
						let log = {
							id: 0,
							chave: msg.id,
							tabela: "TBTipoItem",
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
					if(resposta.codigo == 200){
						let log = {
							id: 0,
							chave: msg.id,
							tabela: "TBTipoItem",
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

		if(tipoItem.id == 1){
			cb(414);
		}
		
		require('./controller.js').excluir("TipoItem", tipoItem, function(codRes){
			cb(codRes);
		});
	},

	listar: function(cb){ //Lista todos os registros da tabela;
		require('./controller.js').listar("TipoItem", function(res){
			cb(res);
		}, {orderBy: [{campo: "nome", sentido: "asc"}]});
	},

	buscar: function(argumentos, cb){ //Busca registros na tabela baseado nos argumentos recebidos pelo servidor
		require('./controller.js').buscar("TipoItem", argumentos, function(res){
			cb(res);
		});		
	}
}
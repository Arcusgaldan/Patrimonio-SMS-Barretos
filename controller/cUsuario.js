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
					//console.log("Em cUsuario:trataOperacao, recebi o callback do cUsuario:inserir com código " + codRes + "\n"); (Testando a conexão por pool)
					resposta.codigo = codRes;
					if(resposta.codigo == 200){
						require('./controller.js').proximoID("Usuario", function(id){						
							msg.id = parseInt(id) - 1;
							let log = {
								id: 0,
								chave: parseInt(id) - 1,
								tabela: "TBUsuario",
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
							tabela: "TBUsuario",
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
				if(msg.id == 1){
					resposta.codigo = 414;
					cb(resposta);
				}
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
							tabela: "TBUsuario",
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
				case 'INATIVAR':
					if(msg.id == 1){
						resposta.codigo = 414;
						cb(resposta);
					}
					if(!usuario){
						resposta.codigo = 413;
						cb(resposta);
					}
					this.inativar(msg, function(codRes){
						resposta.codigo = codRes;
						if(resposta.codigo == 200){
							let log = {
								id: 0,
								chave: msg.id,
								tabela: "TBUsuario",
								operacao: "INATIVAR",
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
					case 'REATIVAR':
						if(!usuario){
							resposta.codigo = 413;
							cb(resposta);
						}
						this.reativar(msg, function(codRes){
							resposta.codigo = codRes;
							if(resposta.codigo == 200){
								let log = {
									id: 0,
									chave: msg.id,
									tabela: "TBUsuario",
									operacao: "REATIVAR",
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

	validar: function(usuario){ //Valida os campos necessários em seu formato ideal
		if(!usuario){
			return false;
		}
		
		var validates = require('./../validates.js');

		if(!validates.req(usuario.id) || !validates.req(usuario.nome) || !validates.req(usuario.email) || !validates.exact(usuario.senha, 64)){
			return false;
		}else{
			return true;
		}
	},

	inserir: function(usuario, cb){ //Insere as informações passadas pelo servidor
		if(!this.validar(usuario)){ //Se os dados não forem válidos, para a execução e retorna código de erro
			cb(412);
			return;
		}
		require('./controller.js').inserir("Usuario", usuario, function(codRes){
			//console.log("Em cUsuario:inserir, recebi o callback do controller com código " + codRes + "\n"); (Testando a conexão por pool)
			cb(codRes);
		});
	},

	alterar: function(usuario, cb){ //Altera as informações passadas por servidor
		if(!this.validar(usuario)){ //Se os dados não forem válidos, para a execução e retorna código de erro
			cb(412);
			return;
		}

		require('./controller.js').alterar("Usuario", usuario, function(codRes){
			cb(codRes);
		});
	},

	excluir: function(usuario, cb){ //Exclui o registro cujo ID seja igual ao ID fornecido pelo servidor
		if(!usuario)
			cb(412);
		else if(!usuario.id)
			cb(412);
		require('./controller.js').excluir("Usuario", usuario, function(codRes){
			cb(codRes);
		});
	},

	listar: function(cb){ //Lista todos os registros da tabela;
		require('./controller.js').listar("Usuario", function(res){
			cb(res);
		}, {campo: 'nome', sentido: 'asc'});
	},

	buscar: function(argumentos, cb){ //Busca registros na tabela baseado nos argumentos recebidos pelo servidor
		require('./controller.js').buscar("Usuario", argumentos, function(res){
			cb(res);
		});		
	},

	inativar: function(usuario, cb){ //Inativa o registro cujo ID seja igual ao ID fornecido pelo servidor
		require('./controller.js').ativar("Usuario", usuario, '0', function(codRes){
			cb(codRes)
		});
	},
	
	reativar: function(usuario, cb){ //Reativa o registro cujo ID seja igual ao ID fornecido pelo servidor
		require('./controller.js').ativar("Usuario", usuario, '1', function(codRes){
			cb(codRes)
		});
	},
}
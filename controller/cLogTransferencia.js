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
						require('./controller.js').proximoID("LogTransferencia", function(id){						
							msg.id = parseInt(id) - 1;
							let log = {
								id: 0,
								chave: parseInt(id) - 1,
								tabela: "TBLogTransferencia",
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
							tabela: "TBLogTransferencia",
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
							tabela: "TBLogTransferencia",
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
			case 'TRANSFERIRLOTE':
				if(!usuario){
					resposta.codigo = 413;
					cb(resposta);
				}
				this.transferirLote(msg.itens, msg.destino, function(codRes, texto){
					resposta.codigo = codRes;
					if(resposta.codigo == 200){
						let log = {
							id: 0,
							chave: 0,
							tabela: "TBLogTransferencia",
							operacao: "TRANSFERIRLOTE",
							mudanca: JSON.stringify(msg),
							data: require('./cData.js').dataHoraAtual(),
							codUsuario: usuario.id
						}
						require('./cLog.js').inserir(log, function(codRes){
							if(codRes == 200){
								if(texto != null){
									texto += "";
									resposta.msg = texto;
								}else{
									console.log("Não há texto em trataOperacao::cLogTransferencia!");
								}
								cb(resposta);		
								return;															
							}else{
								resposta.codigo = 416;
								cb(resposta);
								return;
							}
						});
					}else{
						if(texto != null){
							texto += "";
							resposta.msg = texto;
						}
						cb(resposta);
					}		
				});
				break;
			default:
				resposta.codigo = 410;
				cb(resposta);
		}
	},

	validar: function(logTransferencia){ //Valida os campos necessários em seu formato ideal
		if(!logTransferencia){
			return false;
		}

		var validates = require('./../validates.js');

		if(!validates.req(logTransferencia.id) || !validates.dataHora(logTransferencia.data) || 
			!validates.req(logTransferencia.codLocal) || !validates.req(logTransferencia.codItem) || 
			!validates.req(logTransferencia.atual)){
			console.log("Validar em cLogTransferencia: data teve resultado " + validates.dataHora(logTransferencia.data));
			return false;
		}else{
			return true;
		}
	},

	inserir: function(logTransferencia, cb){ //Insere as informações passadas pelo servidor
		if(!logTransferencia)
			cb(412);
		
		logTransferencia.data = require('./cData.js').dataHoraAtual();
		logTransferencia.atual = 1;

		if(!this.validar(logTransferencia)){ //Se os dados não forem válidos, para a execução e retorna código de erro
			console.log("Não passou na validação de cLogTransferencia::inserir com logTransferencia = " + JSON.stringify(logTransferencia));
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
			// console.log("A resposta da busca em logtransferencia é: " + JSON.stringify(res));
			// console.log("Por outro lado, somente a data da primeira entrada sem o stringify é: " + res[0].dataTransferencia);
			cb(res);
		});		
	},

	transferirLote: function(itens, destino, cb){
		sql = "SELECT i.id idItem, s.id idSetor, l.id idLocal, lt.id idLog FROM TBItem i JOIN TBLogTransferencia lt ON i.id = lt.codItem JOIN TBLocal l ON l.id = lt.codLocal LEFT JOIN TBSetor s ON s.id = lt.codSetor WHERE lt.atual = 1 AND ";
		let stringItens = '(';
		let qtdExcluidos = 0;
		let logs = [];
		let itensFinal = [];
		let alterarLote = this.alterarLote;
		let inserirLote = this.inserirLote;
		for(let i = 0; i < itens.length; i++){
			if(i == itens.length - 1){
				stringItens += 'i.id = ' + itens[i];
			}else{
				stringItens += 'i.id = ' + itens[i] + ' OR ';
			}
		}
		stringItens += ');';
		sql += stringItens;
		let dao = require('./../dao.js');
		dao.buscar(dao.criaConexao(), sql, function(resultado){
			if(resultado){
				for(let i = 0; i < resultado.length; i++){
					if(resultado[i].idLocal == destino.novoLocal && resultado[i].idSetor == destino.novoSetor){
						qtdExcluidos++;
					}else{
						logs.push(resultado[i].idLog);
						itensFinal.push(resultado[i].idItem);
					}
				}
				if(logs.length == 0){
					cb(400, qtdExcluidos);
					return;
				}else{
					alterarLote(logs, 0, function(codRes){
						if(codRes == 200){
							inserirLote(itensFinal, destino, function(codRes){
								if(codRes == 200){
									cb(200, qtdExcluidos);
									return;
								}else{
									alterarLote(logs, 1, function(codRes){
										if(codRes == 200){
											cb(400);
											return;
										}else{
											cb(444);
											return;
										}
									});
								}
							});
						}else{
							cb(400);
							return;
						}
					});
				}
			}else{
				cb(400);
				return;
			}
		});
	},

	alterarLote: function(logs, atual, cb){
		let sql = "UPDATE TBLogTransferencia SET atual = " + atual + " WHERE ";
		let stringLogs = "(";
		for(let i = 0; i < logs.length; i++){
			if(i == logs.length - 1){
				stringLogs += "id = " + logs[i];
			}else{
				stringLogs += "id = " + logs[i] + " OR ";
			}
		}
		stringLogs += ");";
		sql += stringLogs;
		let dao = require('./../dao.js');
		dao.inserir(dao.criaConexao(), sql, function(codRes){
			cb(codRes);
			return;
		});
	},

	inserirLote: function(itens, destino, cb){
		let sql = "INSERT INTO TBLogTransferencia (id, data, codLocal, codSetor, codItem, atual) VALUES ";
		let dataAtual = require('./cData.js').dataHoraAtual();
		let values = "";
		for(let i = 0; i < itens.length; i++){
			if(i == itens.length - 1){
				values += "(0, '" + dataAtual + "', " + destino.novoLocal + ", " + destino.novoSetor + ", " + itens[i] + ", 1);";
			}else{
				values += "(0, '" + dataAtual + "', " + destino.novoLocal + ", " + destino.novoSetor + ", " + itens[i] + ", 1), ";
			}
		}

		sql += values;
		console.log("Em cLogTransferencia::inserirLote, sql = " + sql);
		let dao = require('./../dao.js');
		dao.inserir(dao.criaConexao(), sql, function(codRes){
			cb(codRes);
			return;
		});
	}
}
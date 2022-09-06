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
						require('./controller.js').proximoID("Procedimento", function(id){						
							msg.id = parseInt(id) - 1;
							let log = {
								id: 0,
								chave: parseInt(id) - 1,
								tabela: "TBProcedimento",
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
							tabela: "TBProcedimento",
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
							tabela: "TBProcedimento",
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
			case 'LISTARCOMPUTADOR':
				this.listarComputador(msg.idComputador, function(res){
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

	validar: function(procedimento){ //Valida os campos necessários em seu formato ideal
		let vetorPecas = ["Fonte", "Gabinete", "HD", "Manutenção Preventiva", "Memória", "Placa de Rede", "Placa de Vídeo", "Placa-Mãe", "Processador", "Sistema"];

		if(!procedimento){
			return false;
		}

		var validates = require('./../validates.js');

		if(!validates.req(procedimento.id) || !validates.data(procedimento.data) || !validates.req(procedimento.peca) || 
			!validates.req(procedimento.descricao) || !validates.req(procedimento.codComputador) || vetorPecas.indexOf(procedimento.peca) == -1 || 
			!validates.req(procedimento.setorOrigem)){
			return false;
		}else{
			return true;
		}
	},

	inserir: function(procedimento, cb){ //Insere as informações passadas pelo servidor
		console.log("Em cProcedimento::Inserir, entrei no inicio da função")
		funcValidar = this.validar
		if(procedimento){
			if(!procedimento.data){
				procedimento.data = require('./cData.js').dataAtual();
			}else{
				let utils = require('./../utilsCliente.js');
				let cData = require('./cData.js');
				if(utils.comparaData(procedimento.data.substring(0, 10), cData.dataAtual()) == 1){
					cb(415);
					return;
				}
			}
		}
		require('./cComputador').getSetor(procedimento.codComputador, function(codSetor){
			console.log("Em cProcedimento::Inserir, requisitei o codSetor")
			console.log("Em cProcedimento::Inserir, meu codSetor é " + codSetor)
			if(codSetor == null){
				cb(421)
				return
			}
			procedimento.setorOrigem = codSetor
			if(!funcValidar(procedimento)){ //Se os dados não forem válidos, para a execução e retorna código de erro
				cb(412);
				return;
			}
			require('./controller.js').inserir("Procedimento", procedimento, function(codRes){
				cb(codRes);
			});
		});		
	},

	alterar: function(procedimento, cb){ //Altera as informações passadas por servidor
		if(procedimento){
			if(procedimento.data){
				let utils = require('./../utilsCliente.js');
				let cData = require('./cData.js');
				if(utils.comparaData(procedimento.data.substring(0, 10), cData.dataAtual()) == 1){
					cb(415);
					return;
				}
			}
		}
		if(!this.validar(procedimento)){ //Se os dados não forem válidos, para a execução e retorna código de erro
			cb(412);
			return;
		}

		require('./controller.js').alterar("Procedimento", procedimento, function(codRes){
			cb(codRes);
		});
	},

	excluir: function(procedimento, cb){ //Exclui o registro cujo ID seja igual o ID fornecido pelo servidor
		if(!procedimento)
			cb(412);
		else if(!procedimento.id)
			cb(412);
		require('./controller.js').excluir("Procedimento", procedimento, function(codRes){
			cb(codRes);
		});
	},

	listar: function(cb){ //Lista todos os registros da tabela;
		require('./controller.js').listar("Procedimento", function(res){
			cb(res);
		}, {orderBy: [{campo: 'peca', sentido: 'asc'}]});
	},

	buscar: function(argumentos, cb){ //Busca registros na tabela baseado nos argumentos recebidos pelo servidor
		require('./controller.js').buscar("Procedimento", argumentos, function(res){
			cb(res);
		});		
	},

	listarComputador: function(idComputador, cb){
		var argumentos = {};
		argumentos.where = "codComputador = " + idComputador;
		argumentos.orderBy = [{campo: "p.data", sentido: "DESC"}, {campo: "p.peca", sentido: "ASC"}];
		argumentos.aliasTabela = "p";
		argumentos.selectCampos = ["p.*", "i.patrimonio patrimonioComputador"];
		argumentos.joins = [
			{tabela: "TBComputador c", on: "c.id = p.codComputador"},
			{tabela: "TBItem i", on: "i.id = c.codItem"}
		];

		require('./controller.js').buscar("Procedimento", argumentos, function(res){			
			cb(res);
		});
	}
}
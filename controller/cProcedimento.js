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
		let vetorPecas = ["Fonte", "Gabinete", "HD", "Memória", "Placa de Rede", "Placa de Vídeo", "Placa-Mãe", "Processador"];

		if(!procedimento){
			return false;
		}

		var validates = require('./../validates.js');

		if(!validates.req(procedimento.id) || !validates.data(procedimento.data) || !validates.req(procedimento.peca) || 
			!validates.req(procedimento.descricao) || !validates.req(procedimento.codComputador) || vetorPecas.indexOf(procedimento.peca) == -1){
			return false;
		}else{
			return true;
		}
	},

	inserir: function(procedimento, cb){ //Insere as informações passadas pelo servidor
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
		if(!this.validar(procedimento)){ //Se os dados não forem válidos, para a execução e retorna código de erro
			cb(412);
			return;
		}
		require('./controller.js').inserir("Procedimento", procedimento, function(codRes){
			cb(codRes);
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
		});
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
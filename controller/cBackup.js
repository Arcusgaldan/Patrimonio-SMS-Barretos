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
				//console.log("Entrei de fato no trataOperacao com LISTARCOMPUTADOR");
				this.listarComputador(msg.idComputador, function(res){
					// console.log("Entrei no Callback da função listarComputador com res = " + JSON.stringify(res));
					if(res){
						// console.log("Em cBackup::trataOperacao (listarComputador), houve resultado!");
						resposta.codigo = 200;
						resposta.msg = JSON.stringify(res);
					}else{
						// console.log("Em cBackup::trataOperacao (listarComputador), NÃO houve resultado!");
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

	validar: function(backup){ //Valida os campos necessários em seu formato ideal
		if(!backup){
			return false;
		}

		var validates = require('./../validates.js');

		if(!validates.req(backup.id) || !validates.data(backup.data) || !validates.req(backup.codDisco) || !validates.req(backup.nomePasta) || 
			!validates.req(backup.codComputador) || !validates.req(backup.tamanho)){
			return false;
		}else{
			return true;
		}
	},

	inserir: function(backup, cb){ //Insere as informações passadas pelo servidor
		if(backup){
			if(backup.data){
				let utils = require('./../utilsCliente.js');
				let cData = require('./cData.js');
				if(utils.comparaData(backup.data.substring(0, 10), cData.dataAtual()) == 1){
					cb(415);
					return;
				}
			}
		}
		if(!this.validar(backup)){ //Se os dados não forem válidos, para a execução e retorna código de erro
			cb(412);
			return;
		}
		require('./controller.js').inserir("Backup", backup, function(codRes){
			cb(codRes);
		});
	},

	alterar: function(backup, cb){ //Altera as informações passadas por servidor
		if(backup){
			if(backup.data){
				let utils = require('./../utilsCliente.js');
				let cData = require('./cData.js');
				if(utils.comparaData(backup.data.substring(0, 10), cData.dataAtual()) == 1){
					cb(415);
					return;
				}
			}
		}
		if(!this.validar(backup)){ //Se os dados não forem válidos, para a execução e retorna código de erro
			cb(412);
			return;
		}

		require('./controller.js').alterar("Backup", backup, function(codRes){
			cb(codRes);
		});
	},

	excluir: function(backup, cb){ //Exclui o registro cujo ID seja igual o ID fornecido pelo servidor
		if(!backup)
			cb(412);
		else if(!backup.id)
			cb(412);
		require('./controller.js').excluir("Backup", backup, function(codRes){
			cb(codRes);
		});
	},

	listar: function(cb){ //Lista todos os registros da tabela;
		require('./controller.js').listar("Backup", function(res){
			cb(res);
		});
	},

	buscar: function(argumentos, cb){ //Busca registros na tabela baseado nos argumentos recebidos pelo servidor
		require('./controller.js').buscar("Backup", argumentos, function(res){
			cb(res);
		});		
	}, 

	listarComputador: function(idComputador, cb){
		var argumentos = {};
		argumentos.where = "codComputador = " + idComputador;
		argumentos.orderBy = [{campo: "b.data", sentido: "DESC"}];
		argumentos.aliasTabela = "b";
		argumentos.selectCampos = ["b.*", "i.patrimonio patrimonioComputador", "d.nome discoNome"];
		argumentos.joins = [
			{tabela: "TBComputador c", on: "c.id = b.codComputador"},
			{tabela: "TBItem i", on: "i.id = c.codItem"},
			{tabela: "TBDiscoBackup d", on: "d.id = b.codDisco"}
		];

		require('./controller.js').buscar("Backup", argumentos, function(res){
			// console.log("Em cBackup:::listarComputador, entrei no callback do controller::buscar com res = " + JSON.stringify(res));
			cb(res);
		});
	}
}
module.exports = {
	// trataOperacao: function(operacao, msg, cb){
	// 	var resposta = {};
	// 	switch(operacao){
	// 		case 'INSERIR':
	// 			this.inserir(msg, function(codRes){
	// 				resposta.codigo = codRes;
	// 				cb(resposta);
	// 			});
	// 			break;
	// 		case 'BUSCAR':
	// 			this.buscar(msg, function(res){
	// 				if(res){
	// 					resposta.codigo = 200;
	// 					resposta.msg = JSON.stringify(res);
	// 				}else{
	// 					resposta.codigo = 400;
	// 				}
	// 				cb(resposta);
	// 			});
	// 			break;
	// 		default:
	// 			resposta.codigo = 410;
	// 			cb(resposta);
	// 			break;
	// 	}
	// },

	inserir: function(log, cb){
		if(log){
			if(log.mudanca){
				log.mudanca = log.mudanca.replace(/\"/g, '\'');
			}
		}
		require('./controller.js').inserir("Log", log, function(codRes){
			cb(codRes);
		});
	},

	buscar: function(argumentos, cb){
		require('./controller.js').buscar("Log", argumentos, function(res){
			cb(res);
		});
	}
}
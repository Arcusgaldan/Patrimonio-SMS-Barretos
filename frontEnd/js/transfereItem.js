document.getElementById('btnModalTransferencia').addEventListener('click', function(){
	if(document.getElementById('setorItemTransferir').value == document.getElementById('idSetorAntigoItemTransferir').value){
		document.getElementById('msgErroModal').innerHTML = "Por favor, selecione um setor diferente do setor de origem!";
		$("#erroModal").modal('show');
		return;
	}

	document.getElementById('patrimonioItemConfirmaTransferencia').innerHTML = document.getElementById('patrimonioItemTransferir').value;
	document.getElementById('setorAntigoItemConfirmaTransferencia').innerHTML = document.getElementById('setorAntigoItemTransferir').value;
	document.getElementById('setorNovoItemConfirmaTransferencia').innerHTML = $('#setorItemTransferir').children("option:selected").text();
	$("#confirmaTransferenciaModal").modal('show');

}, false);

function completaZero(valor, qtd){
	valor += "";
	let resultado = valor;
	while(resultado.length < qtd){
		resultado = "0" + resultado;
	}
	return resultado;
}

document.getElementById('btnTransferir').addEventListener('click', function(){
	//Enviar requisições para alterar o Log antigo para atual = 0 e criar um novo Log com atual = 1
	var utils = require('./../../utilsCliente.js');
	
	var idItem = document.getElementById('idItemTransferir').value;
	var logAntigo;

	utils.enviaRequisicao('LogTransferencia', 'BUSCAR', {token: localStorage.token, msg: {where: 'codItem = ' + idItem + " AND atual = 1"}}, function(res){
		if(res.statusCode == 200){
			var msg = "";
			res.on('data', function(chunk){
				msg += chunk;
			});
			res.on('end', function(){
				logAntigo = JSON.parse(require('./../../utilsCliente.js').descriptoAES(localStorage.chave, msg))[0];
				console.log("Só para validar data, logAntigo = " + msg);
				logAntigo.atual = 0;
				let dataPadrao = new Date(logAntigo.data);
				logAntigo.data = dataPadrao.getFullYear() + "-" + completaZero(dataPadrao.getMonth() + 1, 2) + "-" + completaZero(dataPadrao.getDate(), 2) + " " + completaZero(dataPadrao.getHours(), 2) + ":" + completaZero(dataPadrao.getMinutes(), 2) + ":" + completaZero(dataPadrao.getSeconds(), 2);
				console.log("Só a data! " + logAntigo.data);
				// logAntigo.data = logAntigo.data.replace('T', ' ');
				// logAntigo.data = logAntigo.data.replace('Z', '');
				console.log("Só para validar data depois da correção, logAntigo = " + JSON.stringify(logAntigo));
				utils.enviaRequisicao('LogTransferencia', 'ALTERAR', {token: localStorage.token, msg: logAntigo}, function(res){
					if(res.statusCode == 200){
						var logNovo = require('./../../model/mLogTransferencia.js').novo();
						logNovo.codItem = document.getElementById('idItemTransferir').value;
						logNovo.codSetor = document.getElementById('setorItemTransferir').value;
						utils.enviaRequisicao('LogTransferencia', 'INSERIR', {token: localStorage.token, msg: logNovo}, function(res){
							if(res.statusCode == 200){								
								$("#sucessoModal").modal('show');
								$('#sucessoModal').on('hide.bs.modal', function(){location.reload();});
						    	setTimeout(function(){location.reload();} , 2000);
							}else{
								logAntigo.atual = 1;
								utils.enviaRequisicao('LogTransferencia', 'ALTERAR', {token: localStorage.token, msg: logAntigo}, function(res){
									if(res.statusCode == 200){
										document.getElementById('msgErroModal').innerHTML = "Erro ao inserir novo registro de transferência, registro anterior reativado. Transferência não concluída.";
										$("#erroModal").modal('show');
										return;
									}else{
										document.getElementById('msgErroModal').innerHTML = "Erro ao inserir novo registro de transferência, falha fatal ao tentar reativar o log anterior. Contate o suporte com urgência.";
										$("#erroModal").modal('show');
										return;
									}
								});
							}
						});
					}else{
						document.getElementById('msgErroModal').innerHTML = "Não foi possível alterar o registro atual, transferência não realizada.";
						$("#erroModal").modal('show');
						return;
					}
				});
			});
		}else{
			document.getElementById('msgErroModal').innerHTML = "Não foi possível encontrar o registro de transferência ativo. Contate o suporte.";
			$("#erroModal").modal('show');
			return;
		}
	});
}, false);
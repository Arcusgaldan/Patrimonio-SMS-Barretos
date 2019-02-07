document.getElementById('btnTransfereLoteModal').addEventListener('click', preencheModal, false);
document.getElementById('btnTransferirLote').addEventListener('click', transferir, false);

function preencheModal(){
	document.getElementById('patrimonioLoteConfirmaTransferencia').innerHTML = document.getElementById('patrimonioLoteTransferir').value;	
	document.getElementById('setorNovoLoteConfirmaTransferencia').innerHTML = $('#setorLoteTransferir').children("option:selected").text();	
	$("#confirmaTransferenciaLoteModal").modal('show');
}

function transferir(){
	let novoSetor = document.getElementById('setorLoteTransferir').value;
	if(novoSetor == '0'){
		document.getElementById('msgErroModal').innerHTML = "Selecione um setor para transferir!";
		$("#erroModal").modal('show');
		return;
	}
	require('./../../utilsCliente.js').enviaRequisicao('LogTransferencia', 'TRANSFERIRLOTE', {token: localStorage.token, msg: {itens: JSON.parse(document.getElementById('idItemTransferirLote').value), destino: novoSetor}}, function(res){
		let qtdExcluidos = "";
		res.on('data', function(chunk){
			qtdExcluidos += chunk;
			console.log("Houve texto na resposta, adicionando " + chunk);
		});
		res.on('end', function(){
			qtdExcluidos = require('./../../utilsCliente.js').descriptoAES(localStorage.chave, qtdExcluidos);
			switch(res.statusCode){
				case 200:
					console.log("Meu qtdExcluidos = " + qtdExcluidos);
					if(qtdExcluidos == "0"){
						document.getElementById('msgSucessoModal').innerHTML = "Itens transferidos com sucesso!";
						$("#sucessoModal").modal('show');
						$('#sucessoModal').on('hide.bs.modal', function(){location.reload();});
				  		setTimeout(function(){location.reload();} , 2000);
					}else{						
						document.getElementById('msgSucessoModal').innerHTML = qtdExcluidos + " itens já estavam no setor e não foram alterados, os demais foram transferidos com sucesso!";
						$("#sucessoModal").modal('show');
						$('#sucessoModal').on('hide.bs.modal', function(){location.reload();});
						setTimeout(function(){location.reload();} , 6000);
					}
					break;
				case 400:
					if(qtdExcluidos != ""){
						document.getElementById('msgErroModal').innerHTML = "Todos os itens selecionados já pertencem ao setor!";
						$("#erroModal").modal('show');
						return;
					}else{
						document.getElementById('msgErroModal').innerHTML = "Erro ao transferir itens.";
						$("#erroModal").modal('show');
						return;
					}
					break;
				case 444:
					document.getElementById('msgErroModal').innerHTML = "Erro fatal na transferência, possível falha de integridade, contatar o suporte com urgência.";
					$("#erroModal").modal('show');
					return;
			}
		});
	});	
}
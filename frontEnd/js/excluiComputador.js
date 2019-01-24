document.getElementById('btnExcluir').addEventListener('click', excluir, false);

document.getElementById('btnModalProcessadorExcluir').addEventListener('click', function(){
	document.getElementById('nomeProcessadorExcluir').innerHTML = $('#selectProcessadorAlterar').children("option:selected").text()
	document.getElementById('idProcessadorExcluir').value = document.getElementById('selectProcessadorAlterar').value;
	$("#excluirProcessadorModal").modal('show');
}, false);
document.getElementById('btnExcluirProcessador').addEventListener('click', excluirProcessador, false);

document.getElementById('btnModalSOExcluir').addEventListener('click', function(){
	document.getElementById('nomeSOExcluir').innerHTML = $('#selectSOAlterar').children("option:selected").text()
	document.getElementById('idSOExcluir').value = document.getElementById('selectSOAlterar').value;
	$("#excluirSOModal").modal('show');
}, false);
document.getElementById('btnExcluirSO').addEventListener('click', excluirSO, false);
document.getElementById('btnDescartar').addEventListener('click', descartar, false);

function preencheProcessador(){
	require('./../../utilsCliente.js').enviaRequisicao("Processador", "LISTAR", {token: localStorage.token}, function(res){
		if(res.statusCode == 200){
			var msg = "";
			res.on('data', function(chunk){
				msg += chunk;
			});
			res.on('end', function(){
				var vetorProcessador = JSON.parse(msg);
				$("#processadorComputadorCadastrar > option").remove();
				$("#processadorComputadorAlterar > option").remove();
				$("#selectProcessadorAlterar > option").remove();
				$("#processadorComputadorBuscar > option").remove();

				$("#processadorComputadorCadastrar").append("<option value='0'>Processador</option>");
				$("#processadorComputadorAlterar").append("<option value='0'>Processador</option>");
				$("#selectProcessadorAlterar").append("<option value='0'>Selecione um processador para alterar</option>");
				$("#processadorComputadorBuscar").append("<option value='0'>Processador</option>");

				for(let i = 0; i < vetorProcessador.length; i++){
					$("#processadorComputadorCadastrar").append("<option value='" + vetorProcessador[i].id + "'>" + vetorProcessador[i].nome + "</option>");
					$("#processadorComputadorAlterar").append("<option value='" + vetorProcessador[i].id + "'>" + vetorProcessador[i].nome + "</option>");
					$("#selectProcessadorAlterar").append("<option value='" + vetorProcessador[i].id + "'>" + vetorProcessador[i].nome + "</option>");
					$("#processadorComputadorBuscar").append("<option value='" + vetorProcessador[i].id + "'>" + vetorProcessador[i].nome + "</option>");
				}
			});
		}else if(res.statusCode != 747){
			document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível buscar processadores";
			$("#erroModal").modal('show');
			return;
		}
	});
}

function preencheSO(){
	require('./../../utilsCliente.js').enviaRequisicao("SistemaOperacional", "LISTAR", {token: localStorage.token}, function(res){
		if(res.statusCode == 200){
			var msg = "";
			res.on('data', function(chunk){
				msg += chunk;
			});
			res.on('end', function(){
				var vetorSO = JSON.parse(msg);
				$("#sistemaComputadorCadastrar > option").remove();
				$("#sistemaComputadorAlterar > option").remove();
				$("#selectSOAlterar > option").remove();
				$("#sistemaComputadorBuscar > option").remove();

				$("#sistemaComputadorCadastrar").append("<option value='0'>Sistema Operacional</option>");
				$("#sistemaComputadorAlterar").append("<option value='0'>Sistema Operacional</option>");
				$("#selectSOAlterar").append("<option value='0'>Selecione um SO para alterar</option>");
				$("#sistemaComputadorBuscar").append("<option value='0'>Sistema Operacional</option>");				

				for(let i = 0; i < vetorSO.length; i++){
					$("#sistemaComputadorCadastrar").append("<option value='" + vetorSO[i].id + "'>" + vetorSO[i].nome + "</option>");
					$("#sistemaComputadorAlterar").append("<option value='" + vetorSO[i].id + "'>" + vetorSO[i].nome + "</option>");
					$("#selectSOAlterar").append("<option value='" + vetorSO[i].id + "'>" + vetorSO[i].nome + "</option>");
					$("#sistemaComputadorBuscar").append("<option value='" + vetorSO[i].id + "'>" + vetorSO[i].nome + "</option>");					
				}
			});
		}else if(res.statusCode != 747){
			document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível buscar processadores";
			$("#erroModal").modal('show');
			return;
		}
	});
}


function excluir(){
	var idComputador = document.getElementById('idComputadorExcluir').value;

	require('./../../utilsCliente.js').enviaRequisicao('Computador', 'EXCLUIR', {token: localStorage.token, msg: {id: idComputador}}, function(res){
		if(res.statusCode == 200){
			$("#sucessoModal").modal('show');
			$('#sucessoModal').on('hide.bs.modal', function(){location.reload();});
	    	setTimeout(function(){location.reload();} , 2000);
		}else{
			document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Por favor contate o suporte.";
			$("#erroModal").modal('show');
			return;
		}
	});
}

function excluirProcessador(){
	var idProcessador = document.getElementById('idProcessadorExcluir').value;

	require('./../../utilsCliente.js').enviaRequisicao('Processador', 'EXCLUIR', {token: localStorage.token, msg: {id: idProcessador}}, function(res){
		if(res.statusCode == 200){
			preencheProcessador();
			$("#excluirProcessadorModal").modal('toggle');
		}else{
			document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Por favor contate o suporte.";
			$("#erroModal").modal('show');
			return;
		}
	});
}

function excluirSO(){
	var idSO = document.getElementById('idSOExcluir').value;

	require('./../../utilsCliente.js').enviaRequisicao('SistemaOperacional', 'EXCLUIR', {token: localStorage.token, msg: {id: idSO}}, function(res){
		if(res.statusCode == 200){
			preencheSO();
			$("#excluirSOModal").modal('toggle');
		}else{
			document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Por favor contate o suporte.";
			$("#erroModal").modal('show');
			return;
		}
	});
}

function descartar(){
	let id = document.getElementById('idComputadorExcluir').value;
	require('./../../utilsCliente.js').enviaRequisicao('Computador', 'BUSCAR', {token: localStorage.token, msg: {where: "id = " + id}}, function(res){
		if(res.statusCode == 200){
			var msg = "";
			res.on('data', function(chunk){
				msg += chunk;
			});
			res.on('end', function(){
				var idItem = JSON.parse(msg)[0].codItem;
				require('./../../utilsCliente.js').enviaRequisicao('Item', 'DESCARTAR', {token: localStorage.token, msg: {id: idItem}}, function(res){
					if(res.statusCode == 200){
						$("#sucessoModal").modal('show');
						$('#sucessoModal').on('hide.bs.modal', function(){location.reload();});
				    	setTimeout(function(){location.reload();} , 2000);
					}else{
						document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Por favor contate o suporte.";
						$("#erroModal").modal('show');
						return;
					}
				});
			});
		}
	});
}
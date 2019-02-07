document.getElementById('btnAlterar').addEventListener('click', alterar, false);
document.getElementById('btnAlterarProcessador').addEventListener('click', alterarProcessador, false);
document.getElementById('btnAlterarSO').addEventListener('click', alterarSO, false);

function alterar(){
	var computador = require('./../../model/mComputador.js').novo();
	computador.id = document.getElementById('idComputadorAlterar').value;
	computador.codItem = document.getElementById('patrimonioComputadorAlterar').value;	
	
	if(document.getElementById('processadorComputadorAlterar').value == '0'){
		computador.codProcessador = null;
	}else{
		computador.codProcessador = document.getElementById('processadorComputadorAlterar').value;
	}

	if(document.getElementById('qtdMemoriaComputadorAlterar').value == "" || document.getElementById('qtdMemoriaComputadorAlterar').value == " "){
		computador.qtdMemoria = null;
	}else{
		computador.qtdMemoria = document.getElementById('qtdMemoriaComputadorAlterar').value;
	}

	if(document.getElementById('tipoMemoriaComputadorAlterar').value == '0'){
		computador.tipoMemoria = null;
	}else{
		computador.tipoMemoria = document.getElementById('tipoMemoriaComputadorAlterar').value;
	}

	if(document.getElementById('armazenamentoComputadorAlterar').value == '')	{
		computador.armazenamento = null;
	}else{
		computador.armazenamento = document.getElementById('armazenamentoComputadorAlterar').value;
	}

	if(document.getElementById('sistemaComputadorAlterar').value == '0'){
		computador.codSO = null;
	}else{
		computador.codSO = document.getElementById('sistemaComputadorAlterar').value;
	}

	if(document.getElementById('reservaComputadorAlterar').checked){
		computador.reserva = 1;
	}else{
		computador.reserva = 0;
	}

	if(document.getElementById('aposentadoComputadorAlterar').checked){
		computador.aposentado = 1;
	}else{
		computador.aposentado = 0;
	}

	if(computador.reserva == 1 && computador.aposentado == 1){
		document.getElementById('msgErroModal').innerHTML = "Computador não pode ser reserva e aposentado ao mesmo tempo.";
		$("#erroModal").modal('show');
		return;
	}

	console.log("Computador a ser alterado: " + JSON.stringify(computador));

	require('./../../utilsCliente.js').enviaRequisicao('Computador', 'ALTERAR', {token: localStorage.token, msg: computador}, function(res){
		if(res.statusCode == 200){
			$("#sucessoModal").modal('show');
			$('#sucessoModal').on('hide.bs.modal', function(){location.reload();});
	  		setTimeout(function(){location.reload();} , 2000);
		}else{
			document.getElementById('msgErroModal').innerHTML = "Não foi possível alterar o computador";
			$("#erroModal").modal('show');
			return;
		}
	});
}

function alterarProcessador(){
	var SO = require('./../../model/mProcessador.js').novo();
	SO.id = document.getElementById('selectProcessadorAlterar').value;
	if(SO.id == '0'){
		document.getElementById('msgErroModal').innerHTML = "Por favor, selecione um SO";
		$("#erroModal").modal('show');
		return;
	}

	SO.nome = document.getElementById('nomeProcessadorAlterar').value;
	if(SO.nome.trim() == ''){
		document.getElementById('msgErroModal').innerHTML = "Por favor, insira um nome";
		$("#erroModal").modal('show');
		return;
	}

	require('./../../utilsCliente.js').enviaRequisicao('Processador', 'ALTERAR', {token: localStorage.token, msg: SO}, function(res){
		if(res.statusCode == 200){
			preencheProcessador();
			$("#alteraProcessadorModal").modal('toggle');
		}else{
			document.getElementById('msgErroModal').innerHTML = "Não foi possível alterar o SO";
			$("#erroModal").modal('show');
			return;
		}
	});
}

function alterarSO(){
	var SO = require('./../../model/mSistemaOperacional.js').novo();
	SO.id = document.getElementById('selectSOAlterar').value;
	if(SO.id == '0'){
		document.getElementById('msgErroModal').innerHTML = "Por favor, selecione um Sistema Operacional";
		$("#erroModal").modal('show');
		return;
	}

	SO.nome = document.getElementById('nomeSOAlterar').value;
	if(SO.nome.trim() == ''){
		document.getElementById('msgErroModal').innerHTML = "Por favor, insira um nome";
		$("#erroModal").modal('show');
		return;
	}

	require('./../../utilsCliente.js').enviaRequisicao('SistemaOperacional', 'ALTERAR', {token: localStorage.token, msg: SO}, function(res){
		if(res.statusCode == 200){
			preencheSO();
			$("#alteraSOModal").modal('toggle');
		}else{
			document.getElementById('msgErroModal').innerHTML = "Não foi possível alterar o Sistema Operacional";
			$("#erroModal").modal('show');
			return;
		}
	});
}

function preencheProcessador(){
	require('./../../utilsCliente.js').enviaRequisicao("Processador", "LISTAR", {token: localStorage.token}, function(res){
		if(res.statusCode == 200){
			var msg = "";
			res.on('data', function(chunk){
				msg += chunk;
			});
			res.on('end', function(){
				var vetorProcessador = JSON.parse(require('./../../utilsCliente.js').descriptoAES(localStorage.chave, msg));
				$("#processadorComputadorCadastrar > option").remove();
				$("#processadorComputadorAlterar > option").remove();
				$("#selectProcessadorAlterar > option").remove();

				$("#processadorComputadorCadastrar").append("<option value='0'>Processador</option>");
				$("#processadorComputadorAlterar").append("<option value='0'>Processador</option>");
				$("#selectProcessadorAlterar").append("<option value='0'>Selecione um SO para alterar</option>");

				for(let i = 0; i < vetorProcessador.length; i++){
					$("#processadorComputadorCadastrar").append("<option value='" + vetorProcessador[i].id + "'>" + vetorProcessador[i].nome + "</option>");
					$("#processadorComputadorAlterar").append("<option value='" + vetorProcessador[i].id + "'>" + vetorProcessador[i].nome + "</option>");
					$("#selectProcessadorAlterar").append("<option value='" + vetorProcessador[i].id + "'>" + vetorProcessador[i].nome + "</option>");
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

				$("#sistemaComputadorCadastrar").append("<option value='0'>Sistema Operacional</option>");
				$("#sistemaComputadorAlterar").append("<option value='0'>Sistema Operacional</option>");
				$("#selectSOAlterar").append("<option value='0'>Selecione um SO para alterar</option>");

				for(let i = 0; i < vetorSO.length; i++){
					$("#sistemaComputadorCadastrar").append("<option value='" + vetorSO[i].id + "'>" + vetorSO[i].nome + "</option>");
					$("#sistemaComputadorAlterar").append("<option value='" + vetorSO[i].id + "'>" + vetorSO[i].nome + "</option>");
					$("#selectSOAlterar").append("<option value='" + vetorSO[i].id + "'>" + vetorSO[i].nome + "</option>");
				}
			});
		}else if(res.statusCode != 747){
			document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível buscar SOes";
			$("#erroModal").modal('show');
			return;
		}
	});
}
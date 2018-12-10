document.getElementById('btnCadastrar').addEventListener('click', cadastrar, false);
document.getElementById('btnCadastrarProcessador').addEventListener('click', cadastrarProcessador, false);
document.getElementById('btnCadastrarSO').addEventListener('click', cadastrarSO, false);

function cadastrar(){
	var computador = require('./../../model/mComputador.js').novo();
	computador.codItem = document.getElementById('patrimonioComputadorCadastrar').value;
	if(computador.codItem == '0'){
		document.getElementById('msgErroModal').innerHTML = "Por favor, insira um patrimônio";
		$("#erroModal").modal('show');
		return;
	}
	
	if(document.getElementById('processadorComputadorCadastrar').value == '0'){
		computador.codProcessador = null;
	}else{
		computador.codProcessador = document.getElementById('processadorComputadorCadastrar').value;
	}

	if(document.getElementById('qtdMemoriaComputadorCadastrar').value == "" || document.getElementById('qtdMemoriaComputadorCadastrar').value == " "){
		computador.qtdMemoria = null;
	}else{
		computador.qtdMemoria = document.getElementById('qtdMemoriaComputadorCadastrar').value;
	}

	if(document.getElementById('tipoMemoriaComputadorCadastrar').value == '0'){
		computador.tipoMemoria = null;
	}else{
		computador.tipoMemoria = document.getElementById('tipoMemoriaComputadorCadastrar').value;
	}

	if(document.getElementById('armazenamentoComputadorCadastrar').value == '')	{
		computador.armazenamento = null;
	}else{
		computador.armazenamento = document.getElementById('armazenamentoComputadorCadastrar').value;
	}

	if(document.getElementById('sistemaComputadorCadastrar').value == '0'){
		computador.codSO = null;
	}else{
		computador.codSO = document.getElementById('sistemaComputadorCadastrar').value;
	}

	if(document.getElementById('reservaComputadorCadastrar').checked){
		computador.reserva = 1;
	}else{
		computador.reserva = 0;
	}

	if(document.getElementById('aposentadoComputadorCadastrar').checked){
		computador.aposentado = 1;
	}else{
		computador.aposentado = 0;
	}

	if(computador.reserva == 1 && computador.aposentado == 1){
		document.getElementById('msgErroModal').innerHTML = "Computador não pode ser reserva e aposentado ao mesmo tempo.";
		$("#erroModal").modal('show');
		return;
	}

	require('./../../utilsCliente.js').enviaRequisicao('Computador', 'INSERIR', {token: localStorage.token, msg: computador}, function(res){
		if(res.statusCode == 200){
			$("#sucessoModal").modal('show');
			$('#sucessoModal').on('hide.bs.modal', function(){location.reload();});
	  		setTimeout(function(){location.reload();} , 2000);
		}else{
			document.getElementById('msgErroModal').innerHTML = "Não foi possível cadastrar o computador";
			$("#erroModal").modal('show');
			return;
		}
	});
}

function cadastrarProcessador(){
	var processador = require('./../../model/mProcessador.js').novo();

	processador.nome = document.getElementById('nomeProcessadorCadastrar').value;
	if(processador.nome == ""){
		document.getElementById('msgErroModal').innerHTML = "Por favor, insira um nome para o processador";
		$("#erroModal").modal('show');
		return;
	}

	require('./../../utilsCliente.js').enviaRequisicao('Processador', 'INSERIR', {token: localStorage.token, msg: processador}, function(res){
		if(res.statusCode == 200){
			$("#cadastraProcessadorModal").modal('toggle');
			preencheProcessador();
		}
	});
}

function cadastrarSO(){
	var SO = require('./../../model/mSistemaOperacional.js').novo();

	SO.nome = document.getElementById('nomeSOCadastrar').value;
	if(SO.nome == ""){
		document.getElementById('msgErroModal').innerHTML = "Por favor, insira um nome para o Sistema Operacional";
		$("#erroModal").modal('show');
		return;
	}

	require('./../../utilsCliente.js').enviaRequisicao('SistemaOperacional', 'INSERIR', {token: localStorage.token, msg: SO}, function(res){
		if(res.statusCode == 200){
			$("#cadastraSOModal").modal('toggle');
			preencheSO();
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
				var vetorProcessador = JSON.parse(msg);
				$("#processadorComputadorCadastrar > option").remove();
				$("#processadorComputadorAlterar > option").remove();
				$("#selectProcessadorAlterar > option").remove();

				$("#processadorComputadorCadastrar").append("<option value='0'>Processador</option>");
				$("#processadorComputadorAlterar").append("<option value='0'>Processador</option>");
				$("#selectProcessadorAlterar").append("<option value='0'>Selecione um processador para alterar</option>");

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
			document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível buscar processadores";
			$("#erroModal").modal('show');
			return;
		}
	});
}
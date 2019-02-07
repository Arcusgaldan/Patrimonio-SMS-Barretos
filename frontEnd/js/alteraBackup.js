document.getElementById('btnAlterar').addEventListener('click', alterar, false);
document.getElementById('btnAlterarDisco').addEventListener('click', alterarDisco, false);
document.getElementById('selectDiscoAlterar').addEventListener('change', preencheAlterarDisco, false);

function preencheAlterarDisco(){
	var select = document.getElementById('selectDiscoAlterar');
	if(select.value == '0'){
		document.getElementById('nomeDiscoAlterar').disabled = true;
		document.getElementById('localDiscoAlterar').disabled = true;
		document.getElementById('tamanhoDiscoAlterar').disabled = true;
		document.getElementById('observacaoDiscoAlterar').disabled = true;
		document.getElementById('formAlteraDisco').reset();
	}else{
		document.getElementById('nomeDiscoAlterar').disabled = false;
		document.getElementById('localDiscoAlterar').disabled = false;
		document.getElementById('tamanhoDiscoAlterar').disabled = false;
		document.getElementById('observacaoDiscoAlterar').disabled = false;

		require('./../../utilsCliente.js').enviaRequisicao('DiscoBackup', 'BUSCAR', {token: localStorage.token, msg: {where: "id = " + select.value}}, function(res){
			if(res.statusCode == 200){
				var msg = "";
				res.on('data', function(chunk){
					msg += chunk;
				});
				res.on('end', function(){
					var disco = JSON.parse(require('./../../utilsCliente.js').descriptoAES(localStorage.chave, msg))[0];
					document.getElementById('nomeDiscoAlterar').value = disco.nome;
					document.getElementById('localDiscoAlterar').value = disco.local;
					document.getElementById('tamanhoDiscoAlterar').value = disco.tamanho;
					document.getElementById('observacaoDiscoAlterar').value = disco.observacao;
				});
			}else{
				document.getElementById('msgErroModal').innerHTML = "Não foi possível buscar dados deste disco";
				$("#erroModal").modal('show');
				return;
			}
		});
	}
}


function buscaComputador(cb){
	var patrimonio = window.location.pathname.split("/")[2];
	// console.log("Em listaBackup::buscaComputador, patrimonio = " + patrimonio);

	var argumentos = {};

	argumentos.selectCampos = ['c.id idComputador'];
	argumentos.where = "i.patrimonio = '" + patrimonio + "'";
	argumentos.joins = [{tabela: "TBItem i", on: "i.id = c.codItem"}];
	argumentos.aliasTabela = "c";

	require('./../../utilsCliente.js').enviaRequisicao("Computador", "BUSCAR", {token: localStorage.token, msg: argumentos}, function(res){
		if(res.statusCode == 200){
			var msg = "";
			res.on('data', function(chunk){
				msg += chunk;
			});
			res.on('end', function(){
				var computador = JSON.parse(require('./../../utilsCliente.js').descriptoAES(localStorage.chave, msg))[0];
				// console.log("Em buscaComputador, computador = " + JSON.stringify(computador));
				cb(computador.idComputador);
			});
		}else{
			cb(null);
			return;
		}
	});
}

function alterar(){
	var backup = require('./../../model/mBackup.js').novo();

	backup.id = document.getElementById('idBackupAlterar').value;
	backup.data = document.getElementById('dataBackupAlterar').value;
	backup.nomePasta = document.getElementById('nomePastaBackupAlterar').value;
	backup.tamanho = document.getElementById('tamanhoBackupAlterar').value;
	backup.codComputador = document.getElementById('computadorBackupAlterar').value;
	backup.codDisco = document.getElementById('discoBackupAlterar').value;
	backup.observacao = document.getElementById('observacaoBackupAlterar').value;
	if(backup.observacao.trim() == "")
		backup.observacao = null;

	if(backup.codDisco == '0'){
		document.getElementById('msgErroModal').innerHTML = "Por favor, selecione um disco de backup";
		$("#erroModal").modal('show');
		return;
	}

	require('./../../utilsCliente.js').enviaRequisicao("Backup", "ALTERAR", {token: localStorage.token, msg: backup}, function(res){
		if(res.statusCode == 200){
			$("#sucessoModal").modal('show');
			$('#sucessoModal').on('hide.bs.modal', function(){location.reload();});
	  		setTimeout(function(){location.reload();} , 2000);
		}else if(res.statusCode == 412){
			document.getElementById('msgErroModal').innerHTML = "Por favor, preencha corretamente os dados";
			$("#erroModal").modal('show');
			return;
		}else{
			document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Por favor contate o suporte.";
			$("#erroModal").modal('show');
			return;
		}
	});
}

function preencheAlterarDisco(){
	var select = document.getElementById('selectDiscoAlterar');
	if(select.value == '0'){
		document.getElementById('nomeDiscoAlterar').disabled = true;
		document.getElementById('localDiscoAlterar').disabled = true;
		document.getElementById('tamanhoDiscoAlterar').disabled = true;
		document.getElementById('observacaoDiscoAlterar').disabled = true;
		document.getElementById('formAlteraDisco').reset();
	}else{
		document.getElementById('nomeDiscoAlterar').disabled = false;
		document.getElementById('localDiscoAlterar').disabled = false;
		document.getElementById('tamanhoDiscoAlterar').disabled = false;
		document.getElementById('observacaoDiscoAlterar').disabled = false;

		require('./../../utilsCliente.js').enviaRequisicao('DiscoBackup', 'BUSCAR', {token: localStorage.token, msg: {where: "id = " + select.value}}, function(res){
			if(res.statusCode == 200){
				var msg = "";
				res.on('data', function(chunk){
					msg += chunk;
				});
				res.on('end', function(){
					var disco = JSON.parse(require('./../../utilsCliente.js').descriptoAES(localStorage.chave, msg))[0];
					document.getElementById('nomeDiscoAlterar').value = disco.nome;
					document.getElementById('localDiscoAlterar').value = disco.local;
					document.getElementById('tamanhoDiscoAlterar').value = disco.tamanho;
					document.getElementById('observacaoDiscoAlterar').value = disco.observacao;
				});
			}else{
				document.getElementById('msgErroModal').innerHTML = "Não foi possível buscar dados deste disco";
				$("#erroModal").modal('show');
				return;
			}
		});
	}
}

function preencheDisco(){
	require('./../../utilsCliente.js').enviaRequisicao("DiscoBackup", "LISTAR", {token: localStorage.token}, function(res){
		if(res.statusCode == 200){
			var msg = "";
			res.on('data', function(chunk){
				msg += chunk;
			});
			res.on('end', function(){
				var vetorDisco = JSON.parse(require('./../../utilsCliente.js').descriptoAES(localStorage.chave, msg));

				$("#discoBackupCadastrar > option").remove();
				$("#discoBackupAlterar > option").remove();
				$("#discoBackupBuscar > option").remove();
				$("#selectDiscoAlterar > option").remove();

				$("#discoBackupCadastrar").append("<option value='0'>Disco de Backup</option>");
				$("#discoBackupBuscar").append("<option value='0'>Disco de Backup</option>");
				$("#discoBackupAlterar").append("<option value='0'>Disco de Backup</option>");
				$("#selectDiscoAlterar").append("<option value='0'>Selecione o disco a ser alterado</option>");

				for(let i = 0; i < vetorDisco.length; i++){
					$("#discoBackupCadastrar").append("<option value='"+vetorDisco[i].id+"'>"+vetorDisco[i].nome+"</option>");
					$("#discoBackupAlterar").append("<option value='"+vetorDisco[i].id+"'>"+vetorDisco[i].nome+"</option>");
					$("#discoBackupBuscar").append("<option value='"+vetorDisco[i].id+"'>"+vetorDisco[i].nome+"</option>");
					$("#selectDiscoAlterar").append("<option value='"+vetorDisco[i].id+"'>"+vetorDisco[i].nome+"</option>");
				}
				preencheAlterarDisco();
			});
		}else if(res.statusCode != 747){
			document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível listar discos de backup";
			$("#erroModal").modal('show');
			return;
		}
	});
}

function alterarDisco(){
	var disco = require('./../../model/mDiscoBackup.js').novo();

	disco.id = document.getElementById('selectDiscoAlterar').value;
	if(disco.id == '0'){
		document.getElementById('msgErroModal').innerHTML = "Por favor, selecione um disco para alterar!";
		$("#erroModal").modal('show');
		return;
	}

	disco.nome = document.getElementById('nomeDiscoAlterar').value;
	disco.local = document.getElementById('localDiscoAlterar').value;
	disco.tamanho = document.getElementById('tamanhoDiscoAlterar').value;
	disco.observacao = document.getElementById('observacaoDiscoAlterar').value;
	if(disco.observacao.trim() == ""){
		disco.observacao = null;
	}

	require('./../../utilsCliente.js').enviaRequisicao('DiscoBackup', 'ALTERAR', {token: localStorage.token, msg: disco}, function(res){
		if(res.statusCode == 200){
			preencheDisco();
			$("#alteraDiscoModal").modal('toggle');
		}else if(res.statusCode == 412){
			document.getElementById('msgErroModal').innerHTML = "Por favor, preencha corretamente os dados";
			$("#erroModal").modal('show');
			return;
		}else{
			document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Por favor contate o suporte.";
			$("#erroModal").modal('show');
			return;
		}
	});
}
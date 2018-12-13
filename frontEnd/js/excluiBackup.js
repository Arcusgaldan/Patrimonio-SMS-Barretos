document.getElementById('btnExcluir').addEventListener('click', excluir, false);
document.getElementById('btnExcluirDisco').addEventListener('click', excluirDisco, false);
document.getElementById('btnModalDiscoExcluir').addEventListener('click', function(){
	document.getElementById('nomeDiscoExcluir').innerHTML = $('#selectDiscoAlterar').children("option:selected").text()
	document.getElementById('idDiscoExcluir').value = document.getElementById('selectDiscoAlterar').value;
	$("#excluirDiscoModal").modal('show');
}, false);

function excluir(){
	let idBackup = document.getElementById('idBackupExcluir').value;

	require('./../../utilsCliente.js').enviaRequisicao('Backup', 'EXCLUIR', {token: localStorage.token, msg: {id: idBackup}}, function(res){
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
					var disco = JSON.parse(msg)[0];
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
				var vetorDisco = JSON.parse(msg);

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

function excluirDisco(){
	let idDisco = document.getElementById('idDiscoExcluir').value;

	require('./../../utilsCliente.js').enviaRequisicao('DiscoBackup', 'EXCLUIR', {token: localStorage.token, msg: {id: idDisco}}, function(res){
		if(res.statusCode == 200){
			preencheDisco();
		}else{
			document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Por favor contate o suporte.";
			$("#erroModal").modal('show');
			return;
		}
		$("#excluirDiscoModal").modal('toggle');
	});
}
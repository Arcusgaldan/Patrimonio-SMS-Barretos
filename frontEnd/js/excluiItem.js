document.getElementById('btnExcluir').addEventListener('click', excluir, false);
document.getElementById('btnExcluirTipo').addEventListener('click', excluirTipo, false);
document.getElementById('btnModalExcluir').addEventListener('click', trocaNome, false);
document.getElementById('btnInativar').addEventListener('click', inativar, false);

function preencheTipo(){
	var utils = require('./../../utilsCliente.js');
	utils.enviaRequisicao("TipoItem", "LISTAR", {token: localStorage.token}, function(res){
		if(res.statusCode == 200){
			var msg = "";
			res.on('data', function(chunk){
				msg += chunk;
			});
			res.on('end', function(){
				var vetorTipo = JSON.parse(require('./../../utilsCliente.js').descriptoAES(localStorage.chave, msg));
				$("#tipoItemCadastrar > option").remove();
				$("#tipoItemAlterar > option").remove();
				$("#selectTipoAlterar > option").remove();

				$("#tipoItemCadastrar").append("<option value='0'>Tipo</option");
				$("#tipoItemAlterar").append("<option value='0'>Tipo</option");
				$("#selectTipoAlterar").append("<option value='0'>Selecione o tipo a ser alterado/excluído</option");
				for(let i = 0; i < vetorTipo.length; i++){
					$("#tipoItemCadastrar").append("<option value='"+vetorTipo[i].id+"'>"+vetorTipo[i].nome+"</option");
					$("#tipoItemAlterar").append("<option value='"+vetorTipo[i].id+"'>"+vetorTipo[i].nome+"</option");
					$("#selectTipoAlterar").append("<option value='"+vetorTipo[i].id+"'>"+vetorTipo[i].nome+"</option");
				}
			});
		}else if(res.statusCode != 747){
			document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível listar tipos de item";
			$("#erroModal").modal('show');
			return;
		}
	});
}

function excluir(){
	require('./../../utilsCliente.js').enviaRequisicao("Item", "EXCLUIR", {token: localStorage.token, msg: {id: document.getElementById('idItemExcluir').value}}, function(res){
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

function excluirTipo(){
	var idTipo = document.getElementById('idTipoItemExcluir').value;
	if(idTipo == '0'){
		document.getElementById('msgErroModal').innerHTML = "Por favor, selecione um tipo de item para excluir";
		$("#erroModal").modal('show');
		return;
	}
	require('./../../utilsCliente.js').enviaRequisicao("TipoItem", "EXCLUIR", {token: localStorage.token, msg: {id: idTipo}}, function(res){
		if(res.statusCode == 200){
			$("#sucessoModal").modal('show');
			$('#excluirTipoModal').modal('toggle');
			preencheTipo();
		}else if(res.statusCode == 414){
			document.getElementById('msgErroModal').innerHTML = "Este tipo de item não pode ser excluído do sistema.";
			$("#erroModal").modal('show');
			return;
		}else{
			document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Por favor contate o suporte.";
			$("#erroModal").modal('show');
			return;
		}
	});
}

function trocaNome(){
	var idTipo = document.getElementById('selectTipoAlterar').value;
	require('./../../utilsCliente.js').enviaRequisicao("TipoItem", "BUSCAR", {token: localStorage.token, msg: {where: "id = " + idTipo}}, function(res){
		if(res.statusCode == 200){
			var msg = "";
			res.on('data', function(chunk){
				msg += chunk;
			});
			res.on('end', function(){
				var tipo = JSON.parse(require('./../../utilsCliente.js').descriptoAES(localStorage.chave, msg))[0];
				document.getElementById('nomeTipoItemExcluir').innerHTML = tipo.nome;
				document.getElementById('idTipoItemExcluir').value = tipo.id;
				$("#excluirTipoModal").modal('show');
			});
		}else{
			document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Por favor contate o suporte.";
			$("#erroModal").modal('show');
			return;
		}
	});
}

function inativar(){
	let id = document.getElementById('idItemExcluir').value;

	if(document.getElementById('btnInativar').innerHTML != "Reativar" && document.getElementById('btnInativar').innerHTML != "Inativar"){
		document.getElementById('msgErroModal').innerHTML = "Operação inválida. Favor contatar o administrador do sistema.";
		$("#erroModal").modal('show');
		return;
	}

	let operacao = document.getElementById('btnInativar').innerHTML == "Reativar" ? "REATIVAR" : "INATIVAR"

	require('./../../utilsCliente.js').enviaRequisicao('Item', operacao, {token: localStorage.token, msg: {id: id}}, function(res){
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
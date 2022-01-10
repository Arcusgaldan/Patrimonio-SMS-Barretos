document.getElementById('btnExcluir').addEventListener('click', excluir, false);
document.getElementById('btnInativar').addEventListener('click', inativar, false);

function excluir(){
	var utils = require('./../../utilsCliente.js');

	utils.enviaRequisicao('Usuario', 'EXCLUIR', {token: localStorage.token, msg: {id: document.getElementById('idUsuarioExcluir').value}}, function(res){
		if(res.statusCode == 200){
			$("#sucessoModal").modal('show');
			$('#sucessoModal').on('hide.bs.modal', function(){location.reload();});
	    	setTimeout(function(){location.reload();} , 2000);
		}else if(res.statusCode == 413){
			document.getElementById('msgErroModal').innerHTML = "Você não possui privilégios para excluir usuários!";
			$("#erroModal").modal('show');
			return;
		}else{
			document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Por favor contate o suporte.";
			$("#erroModal").modal('show');
			return;
		}
	});
}

function inativar(){
	var utils = require('./../../utilsCliente.js');

	if(document.getElementById('btnInativar').innerHTML != "Reativar" && document.getElementById('btnInativar').innerHTML != "Inativar"){
		document.getElementById('msgErroModal').innerHTML = "Operação inválida. Favor contatar o administrador do sistema.";
		$("#erroModal").modal('show');
		return;
	}

	let operacao = document.getElementById('btnInativar').innerHTML == "Reativar" ? "REATIVAR" : "INATIVAR"

	utils.enviaRequisicao('Usuario', operacao, {token: localStorage.token, msg: {id: document.getElementById('idUsuarioExcluir').value}}, function(res){
		if(res.statusCode == 200){
			$("#sucessoModal").modal('show');
			$('#sucessoModal').on('hide.bs.modal', function(){location.reload();});
	    	setTimeout(function(){location.reload();} , 2000);
		}else if(res.statusCode == 413){
			document.getElementById('msgErroModal').innerHTML = "Você não possui privilégios para inativar  usuários!";
			$("#erroModal").modal('show');
			return;
		}else{
			document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Por favor contate o suporte.";
			$("#erroModal").modal('show');
			return;
		}
	});
}








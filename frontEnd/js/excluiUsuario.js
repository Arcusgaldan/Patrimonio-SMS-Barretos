document.getElementById('btnExcluir').addEventListener('click', exclui, false);

function exclui(){
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








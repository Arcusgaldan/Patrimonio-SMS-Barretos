document.getElementById('btnExcluir').addEventListener('click', excluir, false);

function excluir(){
	var idSetor = document.getElementById('idProcedimentoExcluir').value;
	var utils = require('./../../utilsCliente.js');
	utils.enviaRequisicao("Procedimento", "EXCLUIR", {token: localStorage.token, msg: {id: idSetor}}, function(res){
		if(res.statusCode == 200){
			$("#sucessoModal").modal('show');
			$('#sucessoModal').on('hide.bs.modal', function(){location.reload();});
	    	setTimeout(function(){location.reload();} , 2000);
		}else{
			document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível excluir procedimento.";
			$("#erroModal").modal('show');
		}
	});
}
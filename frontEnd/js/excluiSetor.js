document.getElementById('btnExcluir').addEventListener('click', excluir, false);

function excluir(){
	var idSetor = document.getElementById('idSetorExcluir').value;
	var utils = require('./../../utilsCliente.js');
	utils.enviaRequisicao("Setor", "EXCLUIR", {token: localStorage.token, msg: {id: idSetor}}, function(res){
		if(res.statusCode == 200){
			$("#sucessoModal").modal('show');
			$('#sucessoModal').on('hide.bs.modal', function(){location.reload();});
	    	setTimeout(function(){location.reload();} , 2000);
		}else{
			document.getElementById('msgErroModal').innerHTML = "Não foi possível excluir setor";
			$("#erroModal").modal('show');
		}
	});
}
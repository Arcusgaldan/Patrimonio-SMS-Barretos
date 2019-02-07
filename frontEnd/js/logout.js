document.getElementById('btnLogout').addEventListener('click', logout, false);

function logout(){
	if(!localStorage.token){
		document.getElementById('msgErroModal').innerHTML = 'Não foi possível resgatar seu token. Redirecionando para login...';
		$("#erroModal").modal('show');
		$('#erroModal').on('hide.bs.modal', function(){location.href = "/login";});
	}else{
		var utils = require('./../../utilsCliente.js');
		utils.enviaRequisicao("Token", "EXCLUIR", {token: localStorage.token}, function(res){
			if(res.statusCode == 200){
				localStorage.removeItem('token');
				localStorage.removeItem('chave');
				localStorage.removeItem('contInc');
				$("#sucessoModal").modal('show');
				$('#sucessoModal').on('hide.bs.modal', function(){location.href = "/login";});
		    	setTimeout(function(){location.href = "/login";} , 2000);
			}else{
				document.getElementById('msgErroModal').innerHTML = "Não foi possível realizar o logout. Por favor contate o suporte.";
				$('#erroModal').modal('show');
			}
		});
	}
}
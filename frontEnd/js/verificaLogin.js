if(!localStorage.token){
	location.href = "/login";	
}else{
	var utils = require('./../../utilsCliente.js');

	utils.enviaRequisicao("Token", "VALIDAR", {token: localStorage.token}, function(res){
		if(res.statusCode == 400){
			document.getElementById("msgErroModal").innerHTML = 'Algo deu errado com sua autenticação. Por favor, faça login novamente.';			
			$('#erroModal').on('hide.bs.modal', function(){location.href = "/login";});
			localStorage.removeItem('token');
		}
	});
}
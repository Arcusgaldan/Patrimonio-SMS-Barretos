if(!localStorage.token){
	location.href = "/login";	
}else{
	var utils = require('./../../utilsCliente.js');

	utils.enviaRequisicao("Token", "BUSCAR", {token: localStorage.token}, function(res){
		if(res.statusCode == 400){
			document.getElementById("msgErroModal").innerHTML = 'Algo deu errado com sua autenticação. Por favor, faça login novamente.';			
			$('#erroModal').modal('show');
			$('#erroModal').on('hide.bs.modal', function(){location.href = "/login";});
			localStorage.removeItem('token');
		}else if(res.statusCode == 200){
			var msg = "";
			res.on('data', function(chunk){
				msg += chunk;
			});
			res.on('end', function(){
				var usuario = JSON.parse(msg);
				if(usuario.senhaExpirada == 1){
					location.href = "/senhaExpirada";
				}
			});
		}
	});
}
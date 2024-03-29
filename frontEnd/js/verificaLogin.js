if(!localStorage.token){
	location.href = "/login";	
}else{
	var utils = require('./../../utilsCliente.js');

	utils.enviaRequisicao("Token", "BUSCAR", {token: localStorage.token}, function(res){
		if(res.statusCode == 400){
			location.href = "/login";
			localStorage.removeItem('token');
			localStorage.removeItem('chave');
			localStorage.removeItem('contInc');
		}else if(res.statusCode == 200){
			var msg = "";
			res.on('data', function(chunk){
				msg += chunk;
			});
			res.on('end', function(){
				var usuario = JSON.parse(require('./../../utilsCliente.js').descriptoAES(localStorage.chave, msg));
				if(usuario.senhaExpirada == 1){
					location.href = "/senhaExpirada";
				}
			});
		}
	});
}
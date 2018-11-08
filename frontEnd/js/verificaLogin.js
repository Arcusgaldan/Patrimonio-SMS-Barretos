if(!localStorage.token){
	location.href = "/login";	
}else{
	var utils = require('./../../utilsCliente.js');

	utils.enviaRequisicao("Token", "VALIDAR", {token: localStorage.token}, function(res){
		if(res.statusCode == 400){
			document.getElementByTagName('body').style.display = "none";
			alert('Algo deu errado com sua autenticação. Por favor, faça login novamente.');
			localStorage.removeItem('token');
		}
	});
}
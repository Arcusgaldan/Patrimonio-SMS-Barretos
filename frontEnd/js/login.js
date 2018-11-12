document.getElementById('btnLogin').addEventListener('click', login, false);

function login(){
	var utils = require('./../../utilsCliente.js');
	var objeto = {
		email: document.getElementById('emailLogin').value,
		senha: utils.senhaHash(document.getElementById('senhaLogin').value)
	};
	
	utils.enviaRequisicao("Token", "CRIAR", objeto, function(res){
		if(res.statusCode == 200){
			var msg = "";
			res.on('data', function(chunk){
				msg += chunk;
			});
			res.on('end', function(){
				localStorage.token = msg;
		    	var form = document.getElementById('formLogin');
		    	form.method = "POST";
		    	form.action = "/index";
		    	form.submit();
			});
		}else if(res.statusCode == 411){
			document.getElementById('msgErroModal').innerHTML = 'Email ou senha inválidos!';
			$('#erroModal').modal('show');
		}else{
			document.getElementById('msgErroModal').innerHTML = 'Ocorreu algum erro (Erro ' + res.statusCode + '). Por favor, contate o suporte.';
			$('#erroModal').modal('show');
		}
	});

}
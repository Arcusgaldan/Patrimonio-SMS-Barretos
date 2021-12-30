document.getElementById('btnRedefinir').addEventListener('click', redefinir, false);

function redefinir(){
	var senha = document.getElementById('senhaRedefinir').value;
	var confirmaSenha = document.getElementById('confirmaSenhaRedefinir').value;

	if(senha.length < 8){
		document.getElementById('msgErroModal').innerHTML = "A senha tem que ter ao menos 8 caracteres!";
		$("#erroModal").modal('show');
	}else if(senha !== confirmaSenha){
		document.getElementById('msgErroModal').innerHTML = "As senhas devem ser iguais!";
		$("#erroModal").modal('show');
	}else{
		var utils = require('./../../utilsCliente.js');
		utils.enviaRequisicao("Token", "BUSCAR", {token: localStorage.token}, function(res){
			if(res.statusCode == 200){
				var msg = "";
				res.on('data', function(chunk){
					msg += chunk;
				});
				res.on('end', function(){
					var usuario = JSON.parse(require('./../../utilsCliente.js').descriptoAES(localStorage.chave, msg));
					usuario.senha = utils.senhaHash(senha);
					usuario.senhaExpirada = 0;
					utils.enviaRequisicao("Usuario", "ALTERAR", {token: localStorage.token, msg: usuario}, function(res){
						if(res.statusCode == 200){
							utils.enviaRequisicao("Token", "ALTERAR", {token: localStorage.token, msg: usuario}, function(res){
								if(res.statusCode == 200){		
									location.href = "/index";
								}else{
									document.getElementById('msgErroModal').innerHTML = "Falha ao atualizar o token, finalizando sessão...";
									$("#erroModal").modal('show');
									localStorage.removeItem('token');
									$('#erroModal').on('hide.bs.modal', function(){location.href = "/login";});
							    	setTimeout(function(){location.href = "/login";} , 2000);
								}
							});
						}else{
							document.getElementById('msgErroModal').innerHTML = "Não foi possível alterar a senha";
							$("#erroModal").modal('show');
						}
					});
				});
			}else{
				document.getElementById('msgErroModal').innerHTML = "Não foi possível buscar seu token.";
				$("#erroModal").modal('show');
			}
		});
	}
}

if(localStorage.token){
	var utils = require('./../../utilsCliente.js');

	utils.enviaRequisicao('Token', 'BUSCAR', {token: localStorage.token}, function(res){
		if(res.statusCode == 200){
			var msg = "";
			res.on('data', function(chunk){
				msg += chunk;
			});
			res.on('end', function(){
				//console.log(msg)
				var usuario = JSON.parse(require('./../../utilsCliente.js').descriptoAES(localStorage.chave, msg));
				if(usuario.senhaExpirada == 0){
					document.getElementById('msgErroModal').innerHTML = "Sua senha não está expirada. Redirecionando para a página principal";
					$("#erroModal").modal('show');
					$('#erroModal').on('hide.bs.modal', function(){location.href = "/index";});
			    	setTimeout(function(){location.href = "/index";} , 2000);
				}
			});
		}else{
			document.getElementById('msgErroModal').innerHTML = "Não foi possível buscar seu token. Redirecionando para a página de login";
			$("#erroModal").modal('show');
			$('#erroModal').on('hide.bs.modal', function(){location.href = "/login";});
	    	setTimeout(function(){location.href = "/login";} , 2000);
		}
	});
}else{
	document.getElementById('msgErroModal').innerHTML = "Há algo de errado com sua autenticação. Redirecionando para a página de login...";
	$("#erroModal").modal('show');
	$('#erroModal').on('hide.bs.modal', function(){location.href = "/login";});
	setTimeout(function(){location.href = "/login";} , 2000);	
}
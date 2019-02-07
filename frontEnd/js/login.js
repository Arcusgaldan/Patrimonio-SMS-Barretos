document.getElementById('btnLogin').addEventListener('click', login, false);

function login(){
	var utils = require('./../../utilsCliente.js');
	var chave = JSON.stringify(utils.geraAES());
	// console.log("TESTE001: ([): " + chave[0]);
	// let chaveTeste = JSON.parse(chave);
	// console.log("TESTE002: (Primeiro elemento da chave): " + chaveTeste[0]);	
	// console.log("Chave gerada pelo sistema = " + chave);
	var objeto = {
		email: document.getElementById('emailLogin').value,
		senha: utils.senhaHash(document.getElementById('senhaLogin').value),
		chave: utils.criptoRSA(chave)
	};
	
	utils.enviaRequisicao("Token", "CRIAR", objeto, function(res){
		if(res.statusCode == 200){
			var msg = "";
			res.on('data', function(chunk){
				msg += chunk;
			});
			res.on('end', function(){
				localStorage.token = msg;
				// console.log("TESTE003: (Primeiro elemento da chave): " + JSON.parse(chave)[0]);
				localStorage.chave = chave;
				// console.log("TESTE004: (Primeiro elemento da chave): " + localStorage.chave[0]);
				// console.log("Chave com parse: " + JSON.parse(chave));
				// console.log("localStorage.chave: " + localStorage.chave);
				// console.log("localStorage.chave[0]: " + localStorage.chave[0]);
				localStorage.contInc = 1;
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
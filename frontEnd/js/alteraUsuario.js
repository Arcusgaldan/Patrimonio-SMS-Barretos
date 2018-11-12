document.getElementById('btnAlterar').addEventListener('click', altera, false);

function altera(){
	var modelo = require('./../../model/mUsuario.js').novo();
	var utils = require('./../../utilsCliente.js');

	modelo.id = document.getElementById('idUsuarioAlterar').value;
	modelo.nome = document.getElementById('nomeUsuarioAlterar').value;
	modelo.cpf = document.getElementById('cpfUsuarioAlterar').value;
	modelo.email = document.getElementById('emailUsuarioAlterar').value;

	if(document.getElementById('senhaUsuarioAlterar').value == ""){
		modelo.senha = document.getElementById('senhaAntigaUsuarioAlterar').value;
	}else if(document.getElementById('senhaUsuarioAlterar').value !== document.getElementById('confirmaSenhaUsuarioAlterar').value){
		document.getElementById('msgErroModal').innerHTML = "Senhas não conferem";
		$("#erroModal").modal('show');
		return;
	}else{
		modelo.senha = utils.senhaHash(document.getElementById('senhaUsuarioAlterar').value);
	}

	if(document.getElementById('senhaExpiradaUsuarioAlterar').checked){
		modelo.senhaExpirada = 1;
	}else{
		modelo.senhaExpirada = 0;
	}

	utils.enviaRequisicao("Usuario", "ALTERAR", {token: localStorage.token, msg: modelo}, function(res){
		if(res.statusCode == 200){
			$("#sucessoModal").modal('show');
			$('#sucessoModal').on('hide.bs.modal', function(){location.reload();});
	    	setTimeout(function(){location.reload();} , 2000);
			
		}else if(res.statusCode == 412){
			document.getElementById('msgErroModal').innerHTML = "Por favor, preencha corretamente os dados";
			$("#erroModal").modal('show');
			return;
		}else{
			document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Por favor contate o suporte.";
			$("#erroModal").modal('show');
			return;		
		}
	});
}
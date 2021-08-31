document.getElementById('btnCadastrar').addEventListener('click', cadastra, false);

function cadastra(){

	var utils = require('./../../utilsCliente.js');
	var modelo = require('./../../model/mUsuario.js').novo();

	modelo.nome = document.getElementById('nomeUsuarioCadastrar').value;
	modelo.email = document.getElementById('emailUsuarioCadastrar').value;

	if(document.getElementById('senhaUsuarioCadastrar').value !== document.getElementById('confirmaSenhaUsuarioCadastrar').value){
		document.getElementById('msgErroModal').innerHTML = "Senhas não conferem";
		$("#erroModal").modal('show');
		return;
	}else{
		modelo.senha = utils.senhaHash(document.getElementById('senhaUsuarioCadastrar').value);
	}

	if(senhaExpiradaUsuarioCadastrar.checked){
		modelo.senhaExpirada = 1;
	}

	var controller = require('./../../controller/cUsuario.js');
	if(!controller.validar(modelo)){
		document.getElementById('msgErroModal').innerHTML = "Por favor, preencha corretamente os dados";
		$("#erroModal").modal('show');
		return;
	}

	utils.enviaRequisicao("Usuario", "INSERIR", {token: localStorage.token, msg: modelo}, function(res){
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
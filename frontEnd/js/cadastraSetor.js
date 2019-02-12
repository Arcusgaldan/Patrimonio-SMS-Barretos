document.getElementById('btnCadastrar').addEventListener('click', cadastrar, false);
document.getElementById('btnCadastrarLocal').addEventListener('click', cadastrarLocal, false);

function cadastrar(){
	var modelo = require('./../../model/mSetor.js').novo();
	modelo.nome = document.getElementById('nomeSetorCadastrar').value;
	modelo.codLocal = document.getElementById('localSetorCadastrar').value;
	modelo.sigla = document.getElementById('siglaSetorCadastrar').value;

	var controller = require('./../../controller/cSetor.js');

	if(!controller.validar(modelo)){
		document.getElementById('msgErroModal').innerHTML = "Por favor, preencha corretamente os dados";
		$("#erroModal").modal('show');
		return;
	}

	var utils = require('./../../utilsCliente.js');
	utils.enviaRequisicao("Setor", "INSERIR", {token: localStorage.token, msg: modelo}, function(res){
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

function cadastrarLocal(){
	let modelo = require('./../../model/mLocal.js').novo();
	modelo.nome = document.getElementById('nomeLocalCadastrar').value;
	modelo.endereco = document.getElementById('enderecoLocalCadastrar').value;
	modelo.telefone = document.getElementById('telefoneLocalCadastrar').value;

	require('./../../utilsCliente.js').enviaRequisicao("Local", "INSERIR", {token: localStorage.token, msg: modelo}, function(res){
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
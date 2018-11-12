document.getElementById('btnAlterar').addEventListener('click', alterar, false);

function alterar(){
	var modelo = require('./../../model/mSetor.js').novo();
	modelo.id = document.getElementById('idSetorAlterar').value;
	modelo.nome = document.getElementById('nomeSetorAlterar').value;
	modelo.local = document.getElementById('localSetorAlterar').value;
	modelo.sigla = document.getElementById('siglaSetorAlterar').value;

	var controller = require('./../../controller/cSetor.js');

	if(!controller.validar(modelo)){
		document.getElementById('msgErroModal').innerHTML = "Por favor, preencha corretamente os dados";
		$("#erroModal").modal('show');
		return;
	}

	var utils = require('./../../utilsCliente.js');
	utils.enviaRequisicao("Setor", "ALTERAR", {token: localStorage.token, msg: modelo}, function(res){
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
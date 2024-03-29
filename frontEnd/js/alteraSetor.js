document.getElementById('btnModalLocalAlterar').addEventListener('click', function(){
	document.getElementById('selectLocalAlterar').value = document.getElementById('localSetorAlterar').value
	preencheAlterarLocal()
}, false);
document.getElementById('btnAlterar').addEventListener('click', alterar, false);
document.getElementById('btnAlterarLocal').addEventListener('click', alterarLocal, false);
document.getElementById('selectLocalAlterar').addEventListener('change', preencheAlterarLocal, false);

function preencheAlterarLocal(){
	var select = document.getElementById('selectLocalAlterar');
	if(select.value == '0'){
		//console.log("Valor do select é: " + select.value)
		document.getElementById('nomeLocalAlterar').disabled = true;
		document.getElementById('enderecoLocalAlterar').disabled = true;
		document.getElementById('telefoneLocalAlterar').disabled = true;
		document.getElementById('coordenadorLocalAlterar').disabled = true;
		document.getElementById('nomeLocalAlterar').value = "";
		document.getElementById('enderecoLocalAlterar').value = "";
		document.getElementById('telefoneLocalAlterar').value = "";
		document.getElementById('coordenadorLocalAlterar').value = "";
	}else{
		document.getElementById('nomeLocalAlterar').disabled = false;
		document.getElementById('enderecoLocalAlterar').disabled = false;
		document.getElementById('telefoneLocalAlterar').disabled = false;
		document.getElementById('coordenadorLocalAlterar').disabled = false;

		require('./../../utilsCliente.js').enviaRequisicao('Local', 'BUSCAR', {token: localStorage.token, msg: {where: "id = " + select.value}}, function(res){
			if(res.statusCode == 200){
				var msg = "";
				res.on('data', function(chunk){
					msg += chunk;
				});
				res.on('end', function(){
					var local = JSON.parse(require('./../../utilsCliente.js').descriptoAES(localStorage.chave, msg))[0];
					document.getElementById('nomeLocalAlterar').value = local.nome;
					document.getElementById('enderecoLocalAlterar').value = local.endereco;
					document.getElementById('telefoneLocalAlterar').value = local.telefone;
					document.getElementById('coordenadorLocalAlterar').value = local.coordenador;
				});
			}
		});
	}
}
preencheAlterarLocal();

function alterarLocal(){
	let modelo = require('./../../model/mLocal.js').novo();
	modelo.id = document.getElementById('selectLocalAlterar').value;
	modelo.nome = document.getElementById('nomeLocalAlterar').value;
	modelo.endereco = document.getElementById('enderecoLocalAlterar').value;
	modelo.telefone = document.getElementById('telefoneLocalAlterar').value;
	modelo.coordenador = document.getElementById('coordenadorLocalAlterar').value;

	let controller = require('./../../controller/cLocal.js');

	if(!controller.validar(modelo)){
		document.getElementById('msgErroModal').innerHTML = "Por favor, preencha corretamente os dados";
		$("#erroModal").modal('show');
		return;
	}

	let utils = require('./../../utilsCliente.js');
	utils.enviaRequisicao("Local", "ALTERAR", {token: localStorage.token, msg: modelo}, function(res){
		if(res.statusCode == 200){
			$("#sucessoModal").modal('show');
			$("#alteraLocalModal").modal('toggle');
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

function alterar(){
	var modelo = require('./../../model/mSetor.js').novo();
	modelo.id = document.getElementById('idSetorAlterar').value;
	modelo.nome = document.getElementById('nomeSetorAlterar').value;
	modelo.codLocal = document.getElementById('localSetorAlterar').value;
	if(modelo.nome === "Sem Setor"){
		document.getElementById('msgErroModal').innerHTML = "Não é possível alterar o setor 'Sem Setor'";
		$("#erroModal").modal('show');
		return;
	}

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
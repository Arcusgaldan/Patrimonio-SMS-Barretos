document.getElementById('btnCadastrar').addEventListener('click', cadastrar, false);
document.getElementById('btnCadastrarLocal').addEventListener('click', cadastrarLocal, false);

function preencheLocal(){
	require('./../../utilsCliente.js').enviaRequisicao('Local', 'LISTAR', {token: localStorage.token}, function(res){
		if(res.statusCode == 200){
			var msg = "";
			res.on('data', function(chunk){
				msg += chunk;
			});
			res.on('end', function(){
				let listaLocal = JSON.parse(require('./../../utilsCliente.js').descriptoAES(localStorage.chave, msg));
				$("#localSetorCadastrar > option").remove();
				$("#localSetorAlterar > option").remove();
				$("#localSetorBuscar > option").remove();
				$("#selectLocalAlterar > option").remove();

				$("#localSetorCadastrar").append("<option value='0'>Local</option");
				$("#localSetorAlterar").append("<option value='0'>Local</option");
				$("#localSetorBuscar").append("<option value='0'>Local</option");

				for(let i = 0; i < listaLocal.length; i++){					
					$("#localSetorCadastrar").append("<option value='"+ listaLocal[i].id +"'>" + listaLocal[i].nome + "</option>");
					$("#localSetorAlterar").append("<option value='"+ listaLocal[i].id +"'>" + listaLocal[i].nome + "</option>");
					$("#localSetorBuscar").append("<option value='"+ listaLocal[i].id +"'>" + listaLocal[i].nome + "</option>");
					$("#selectLocalAlterar").append("<option value='"+ listaLocal[i].id +"'>" + listaLocal[i].nome + "</option>");
				}
			});
		}else if(res.statusCode != 747){
			document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível listar local";
			$("#erroModal").modal('show');
			return;
		}
	});
}

function cadastrar(){
	var modelo = require('./../../model/mSetor.js').novo();
	modelo.nome = document.getElementById('nomeSetorCadastrar').value;
	modelo.codLocal = document.getElementById('localSetorCadastrar').value;

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
	modelo.coordenador = document.getElementById('coordenadorLocalCadastrar').value;

	require('./../../utilsCliente.js').enviaRequisicao("Local", "INSERIR", {token: localStorage.token, msg: modelo}, function(res){
		if(res.statusCode == 200){
			preencheLocal();
			$("#sucessoModal").modal('show');
			$('#sucessoModal').on('hide.bs.modal', function(){$('#cadastraLocalModal').modal('hide')});
	  		setTimeout(function(){$('#cadastraLocalModal').modal('hide')} , 2000);
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
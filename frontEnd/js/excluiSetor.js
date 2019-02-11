document.getElementById('btnExcluir').addEventListener('click', excluir, false);
document.getElementById('btnLocalExcluir').addEventListener('click', excluirLocal, false);
document.getElementById('btnModalLocalExcluir').addEventListener('click', function(){
	document.getElementById('nomeLocalExcluir').innerHTML = $('#selectLocalAlterar').children("option:selected").text()
	document.getElementById('idLocalExcluir').value = document.getElementById('selectLocalAlterar').value;
	$("#excluirLocalModal").modal('show');
}, false);

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

function excluirLocal(){
	let idLocal = document.getElementById('idLocalExcluir').value;
	require('./../../utilsCliente').enviaRequisicao("Local", "EXCLUIR", {token: localStorage.token, msg: {id: idLocal}}, function(res){
		if(res.statusCode == 200){
			$("#sucessoModal").modal('show');
			$("#alteraLocalModal").modal('toggle');
			$("#excluirLocalModal").modal('toggle');
			preencheLocal();
		}else{
			document.getElementById('msgErroModal').innerHTML = "Não foi possível excluir local";
			$("#erroModal").modal('show');
		}
	});
}

function excluir(){
	var idSetor = document.getElementById('idSetorExcluir').value;
	var utils = require('./../../utilsCliente.js');
	utils.enviaRequisicao("Setor", "EXCLUIR", {token: localStorage.token, msg: {id: idSetor}}, function(res){
		if(res.statusCode == 200){
			$("#sucessoModal").modal('show');
			$('#sucessoModal').on('hide.bs.modal', function(){location.reload();});
	    	setTimeout(function(){location.reload();} , 2000);
		}else{
			document.getElementById('msgErroModal').innerHTML = "Não foi possível excluir setor";
			$("#erroModal").modal('show');
		}
	});
}
document.getElementById('btnBuscar').addEventListener('click', buscar, false);
document.getElementById('btnLimparBusca').addEventListener('click', function(){
	document.getElementById('formBuscarSetor').reset();
}, false);

function buscar(){
	var utils = require('./../../utilsCliente.js');
	var where = "";

	if(document.getElementById('nomeSetorBuscar').value != ""){
		let nome = document.getElementById('nomeSetorBuscar').value;

		if(where != "")
			where += " AND ";

		where += "nome LIKE '%" + nome + "%'";
	}

	if(document.getElementById('localSetorBuscar').value != "0"){
		let local = document.getElementById('localSetorBuscar').value;

		if(where != "")
			where += " AND ";

		where += "codLocal = " + local;
	}

	if(document.getElementById('siglaSetorBuscar').value != ""){
		let sigla = document.getElementById('siglaSetorBuscar').value;

		if(where != "")
			where += " AND ";

		where += "sigla LIKE '%" + sigla + "%'";
	}

	if(where == ""){
		utils.enviaRequisicao("Setor", "LISTAR", {token: localStorage.token}, function(res){
			if(res.statusCode == 200){
				var msg = "";
				res.on('data', function(chunk){
					msg += chunk;
				});
				res.on('end', function(){
					let listaSetor = JSON.parse(require('./../../utilsCliente.js').descriptoAES(localStorage.chave, msg));
					preencheTabela(listaSetor);
				});
			}else if(res.statusCode == 747){
				$("#tabelaSetor").empty();
			}else{
				document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível listar setores";
				$("#erroModal").modal('show');
				return;
			}
			$("#buscaModal").modal('toggle');
		});
	}else{
		var argumentos = {};
		argumentos.where = where;
		argumentos.joins = [{tabela: "TBLocal l", on: "l.id = TBSetor.codLocal"}];
		argumentos.selectCampos = ["TBSetor.*", "l.nome localNome", "l.id localId"];

		utils.enviaRequisicao("Setor", "BUSCAR", {token: localStorage.token, msg: argumentos}, function(res){
			if(res.statusCode == 200){
				var msg = "";
				res.on('data', function(chunk){
					msg += chunk;
				});
				res.on('end', function(){
					let listaSetor = JSON.parse(require('./../../utilsCliente.js').descriptoAES(localStorage.chave, msg));
					preencheTabela(listaSetor);
				});
			}else if(res.statusCode == 747){
				$("#tabelaSetor").empty();
			}else{
				document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível listar setores";
				$("#erroModal").modal('show');
				return;
			}
			$("#buscaModal").modal('toggle');
		});
	}
}

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

function preencheTabela(listaSetor){
	if(!listaSetor){
		return;
	}
	$("#tabelaSetor").empty();
	for(let i = 0; i < listaSetor.length; i++){
		$("#tabelaSetor").append("\
		<tr>\
		    <th id='nomeSetorLista"+ i +"'></th>\
		    <td>\
				<button class='btn btn-info' scope='row' data-toggle='collapse' href='#collapseSetorLista"+ i +"' role='button' aria-expanded='false' aria-controls='collapseExample'> Mostra Dados <span class='fas fa-plus'></span></button>\
				<button id='alterarSetorLista"+ i +"' class='btn btn-warning' data-toggle='modal' data-target='#alteraModal' >Alterar Setor</button>\
				<button id='excluirSetorLista"+ i +"' class='btn btn-danger' data-toggle='modal' data-target='#excluirModal'>Excluir Setor</button>\
				<div id='collapseSetorLista"+ i +"' class='collapse mostraLista' >\
				  <div class='card card-body'>\
				    <p><strong>Nome: </strong><span id='nomeSetorDados"+i+"'></span></p>\
				    <p><strong>Local: </strong> <span id='localSetorDados"+i+"'></span></p>\
				    <p><strong>Sigla: </strong> <span id='siglaSetorDados"+i+"'></span></p>\
				  </div>\
				</div>\
		    </td>\
		  </tr>\
		");

		document.getElementById('nomeSetorLista' + i).innerHTML = listaSetor[i].localNome + " - " + listaSetor[i].nome;
		document.getElementById('nomeSetorDados' + i).innerHTML = listaSetor[i].nome;
		document.getElementById('localSetorDados' + i).innerHTML = listaSetor[i].localNome;
		if(listaSetor[i].sigla)
			document.getElementById('siglaSetorDados' + i).innerHTML = listaSetor[i].sigla;
		else
			document.getElementById('siglaSetorDados' + i).innerHTML = "-";

		(function(){
			var setor = listaSetor[i];		
			document.getElementById("alterarSetorLista"+ i).addEventListener("click", function(){
				preencheModalAlterar(setor);
			}, false);
			document.getElementById("excluirSetorLista"+ i).addEventListener("click", function(){
				preencheModalExcluir(setor);
			}, false);
		}());
	}
}

function preencheModalAlterar(setor){
	document.getElementById('nomeSetorAlterar').value = setor.nome;
	document.getElementById('localSetorAlterar').value = setor.localId;
	document.getElementById('siglaSetorAlterar').value = setor.sigla;
	document.getElementById('idSetorAlterar').value = setor.id;
}

function preencheModalExcluir(setor){
	document.getElementById('nomeSetorExcluir').innerHTML = setor.local + " - " + setor.nome;
	document.getElementById('idSetorExcluir').value = setor.id;
}

preencheLocal();

var utils = require('./../../utilsCliente.js');
utils.enviaRequisicao("Setor", "LISTAR", {token: localStorage.token}, function(res){
	if(res.statusCode == 200){
		var msg = "";
		res.on('data', function(chunk){
			msg += chunk;
		});
		res.on('end', function(){
			var vetorSetor = JSON.parse(require('./../../utilsCliente.js').descriptoAES(localStorage.chave, msg));
			(function(){
				document.getElementById('btnResetLista').addEventListener('click', function(){preencheTabela(vetorSetor)}, false);
			}());
			preencheTabela(vetorSetor);
		});
	}else if(res.statusCode != 747){
		document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível listar setores";
		$("#erroModal").modal('show');
		return;
	}
});
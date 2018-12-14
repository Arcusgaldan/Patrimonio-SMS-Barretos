document.getElementById('btnBuscar').addEventListener('click', buscar, false);
document.getElementById('btnLimparBusca').addEventListener('click', function(){
	document.getElementById('formBuscarProcedimento').reset();
}, false);

function buscar(){
	var utils = require('./../../utilsCliente.js');
	var where = "";

	if(document.getElementById('dataProcedimentoBuscar').value != ""){
		let data = document.getElementById('dataProcedimentoBuscar').value;
		let operador = utils.enumOperador(document.getElementById('argumentoDataProcedimentoBuscar').value);

		if(where != "")
			where += " AND ";

		where += "data " + operador + " '" + data + "'";
	}

	if(document.getElementById('pecaProcedimentoBuscar').value != "0"){
		let peca = document.getElementById('pecaProcedimentoBuscar').value;

		if(where != "")
			where += " AND ";

		where += "peca = '" + peca + "'";
	}	

	if(where == ""){
		buscaComputador(function(idComputador){
			if(!idComputador){
				document.getElementById('msgErroModal').innerHTML = "Não foi possível buscar computador";
				$("#erroModal").modal('show');
				return;
			}
			utils.enviaRequisicao("Procedimento", "LISTARCOMPUTADOR", {token: localStorage.token, msg: {idComputador: idComputador}}, function(res){
				if(res.statusCode == 200){
					var msg = "";
					res.on('data', function(chunk){
						msg += chunk;
					});
					res.on('end', function(){
						let listaProcedimento = JSON.parse(msg);
						preencheTabela(listaProcedimento);
					});
				}else if(res.statusCode == 747){
					$("#tabelaProcedimento").empty();
				}else{
					document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível listar procedimentos";
					$("#erroModal").modal('show');
					return;
				}
				$("#buscaModal").modal('toggle');
			});
		});
	}else{
		buscaComputador(function(idComputador){
			if(!idComputador){
				document.getElementById('msgErroModal').innerHTML = "Não foi possível buscar computador";
				$("#erroModal").modal('show');
				return;
			}
			var argumentos = {};
			argumentos.where = "codComputador = " + idComputador + " AND " + where;
			argumentos.orderBy = [{campo: "p.data", sentido: "DESC"}, {campo: "p.peca", sentido: "ASC"}];
			argumentos.aliasTabela = "p";
			argumentos.selectCampos = ["p.*", "i.patrimonio patrimonioComputador"];
			argumentos.joins = [
				{tabela: "TBComputador c", on: "c.id = p.codComputador"},
				{tabela: "TBItem i", on: "i.id = c.codItem"}
			];
			
			utils.enviaRequisicao("Procedimento", "BUSCAR", {token: localStorage.token, msg: argumentos}, function(res){
				if(res.statusCode == 200){
					var msg = "";
					res.on('data', function(chunk){
						msg += chunk;
					});
					res.on('end', function(){
						let listaProcedimento = JSON.parse(msg);
						preencheTabela(listaProcedimento);
					});
				}else if(res.statusCode == 747){
					$("#tabelaBackup").empty();
				}else{
					document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível listar procedimentos";
					$("#erroModal").modal('show');
					return;
				}
				$("#buscaModal").modal('toggle');
			});
		});
	}
}

function buscaComputador(cb){
	var patrimonio = window.location.pathname.split("/")[2];
	// console.log("Em listaBackup::buscaComputador, patrimonio = " + patrimonio);

	var argumentos = {};

	argumentos.where = "i.patrimonio = '" + patrimonio + "'";
	argumentos.joins = [{tabela: "TBItem i", on: "i.id = c.codItem"}];
	argumentos.aliasTabela = "c";

	require('./../../utilsCliente.js').enviaRequisicao("Computador", "BUSCAR", {token: localStorage.token, msg: argumentos}, function(res){
		if(res.statusCode == 200){
			var msg = "";
			res.on('data', function(chunk){
				msg += chunk;
			});
			res.on('end', function(){
				var computador = JSON.parse(msg)[0];
				// console.log("Em buscaComputador, computador = " + JSON.stringify(computador));
				cb(computador.id);
			});
		}else{
			cb(null);
			return;
		}
	});
}

function preencheTabela(listaProcedimento){	
	if(!listaProcedimento){
		return;
	}
	
	var utils = require('./../../utilsCliente.js');

	$("#tabelaProcedimento").empty();
	for(let i = 0; i < listaProcedimento.length; i++){
		$("#tabelaProcedimento").append("\
		<tr>\
		    <th id='identidadeProcedimentoLista"+ i +"'></th>\
		    <td>\
				<button class='btn btn-info mb-1' scope='row' data-toggle='collapse' href='#collapseProcedimentoLista"+ i +"' role='button' aria-expanded='false' aria-controls='collapseExample'> Mostra Dados <span class='fas fa-plus'></span></button>\
				<button id='alterarProcedimentoLista"+ i +"' class='btn btn-warning mb-1' data-toggle='modal' data-target='#alteraModal' >Alterar Procedimento</button>\
				<button id='excluirProcedimentoLista"+ i +"' class='btn btn-danger mb-1' data-toggle='modal' data-target='#excluirModal'>Excluir Procedimento</button>\
				<div id='collapseProcedimentoLista"+ i +"' class='collapse mostraLista' >\
				  <div class='card card-body'>\
				    <p><strong>Peça: </strong> <span id='pecaProcedimentoDados"+i+"'></span></p>\
				    <p><strong>Descrição: </strong> <span id='descricaoProcedimentoDados"+i+"'></span></p>\
				    <p><strong>Data: </strong><span id='dataProcedimentoDados"+i+"'></span></p>\
				    <p><strong>Computador: </strong> <span id='computadorProcedimentoDados"+i+"'></span></p>\
				  </div>\
				</div>\
		    </td>\
		  </tr>\
		");

		document.getElementById('identidadeProcedimentoLista' + i).innerHTML = listaProcedimento[i].peca + " - " + utils.formataData(listaProcedimento[i].data);
		document.getElementById('dataProcedimentoDados' + i).innerHTML = utils.formataData(listaProcedimento[i].data);

		document.getElementById('pecaProcedimentoDados' + i).innerHTML = listaProcedimento[i].peca;
		document.getElementById('descricaoProcedimentoDados' + i).innerHTML = listaProcedimento[i].descricao;
		document.getElementById('computadorProcedimentoDados' + i).innerHTML = listaProcedimento[i].patrimonioComputador;

		(function(){
			var procedimento = listaProcedimento[i];		
			document.getElementById("alterarProcedimentoLista"+ i).addEventListener("click", function(){
				preencheModalAlterar(procedimento);
			}, false);
			document.getElementById("excluirProcedimentoLista"+ i).addEventListener("click", function(){
				preencheModalExcluir(procedimento);
			}, false);
		}());
	}	
}

function preencheModalAlterar(procedimento){
	document.getElementById('idProcedimentoAlterar').value = procedimento.id;
	document.getElementById('computadorProcedimentoAlterar').value = procedimento.codComputador;
	document.getElementById('pecaProcedimentoAlterar').value = procedimento.peca;
	document.getElementById('descricaoProcedimentoAlterar').value = procedimento.descricao;
	document.getElementById('dataProcedimentoAlterar').value = procedimento.data.substring(0, 10);
}

function preencheModalExcluir(procedimento){
	document.getElementById('idProcedimentoExcluir').value = procedimento.id;
	document.getElementById('pecaProcedimentoExcluir').innerHTML = procedimento.peca;
	document.getElementById('dataProcedimentoExcluir').innerHTML = require('./../../utilsCliente.js').formataData(procedimento.data);
}

buscaComputador(function(idComputador){
	if(!idComputador){
		document.getElementById('msgErroModal').innerHTML = "Não foi possível buscar computador";
		$("#erroModal").modal('show');
		return;
	}
	require('./../../utilsCliente.js').enviaRequisicao('Procedimento', 'LISTARCOMPUTADOR', {token: localStorage.token, msg: {idComputador: idComputador}}, function(res){
		if(res.statusCode == 200){
			var msg = "";
			res.on('data', function(chunk){
				msg += chunk;
			});
			res.on('end', function(){
				var vetorProcedimento = JSON.parse(msg);
				(function(){
					document.getElementById('btnResetLista').addEventListener('click', function(){preencheTabela(vetorProcedimento)}, false);
				}());
				preencheTabela(vetorProcedimento);
			});
		}else if(res.statusCode != 747){
			document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + " Não foi possível listar procedimentos";
			$("#erroModal").modal('show');
			return;
		}
	});
});
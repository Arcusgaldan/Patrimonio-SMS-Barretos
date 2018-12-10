document.getElementById('btnBuscar').addEventListener('click', buscar, false);
document.getElementById('btnLimparBusca').addEventListener('click', function(){
	document.getElementById('formBuscarBackup').reset();
}, false);

function buscaComputador(cb){
	var patrimonio = window.location.pathname.split("/")[2];
	console.log("Em listaBackup::buscaComputador, patrimonio = " + patrimonio);

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
				console.log("Em buscaComputador, computador = " + JSON.stringify(computador));
				cb(computador.id);
			});
		}else{
			cb(null);
			return;
		}
	});
}

function buscar(){
	var utils = require('./../../utilsCliente.js');
	var where = "";

	if(document.getElementById('patrimonioBackupBuscar').value != ""){
		let patrimonio = document.getElementById('patrimonioBackupBuscar').value;

		while(patrimonio.length < 6){
			patrimonio = "0" + patrimonio;
		}

		if(where != "")
			where += " AND ";

		where += "patrimonio = '" + patrimonio + "'";
	}

	if(document.getElementById('marcaBackupBuscar').value != ""){
		let marca = document.getElementById('marcaBackupBuscar').value;

		if(where != "")
			where += " AND ";

		where += "marca LIKE '%" + marca + "%'";
	}

	if(document.getElementById('modeloBackupBuscar').value != ""){
		let modelo = document.getElementById('modeloBackupBuscar').value;

		if(where != "")
			where += " AND ";

		where += "modelo LIKE '%" + modelo + "%'";
	}

	if(document.getElementById('setorBackupBuscar').value != '0'){
		let setor = document.getElementById('setorBackupBuscar').value;

		if(where != "")
			where += " AND ";

		where += "codSetor = " + setor;
	}

	if(document.getElementById('tipoBackupBuscar').value != '0'){
		let tipo = document.getElementById('tipoBackupBuscar').value;

		if(where != "")
			where += " AND ";

		where += "codTipoBackup = " + tipo;
	}

	if(where == ""){
		utils.enviaRequisicao("Backup", "LISTAR", {token: localStorage.token}, function(res){
			if(res.statusCode == 200){
				var msg = "";
				res.on('data', function(chunk){
					msg += chunk;
				});
				res.on('end', function(){
					let listaBackup = JSON.parse(msg);
					preencheTabela(listaBackup);
				});
			}else if(res.statusCode == 747){
				$("#tabelaBackup").empty();
			}else{
				document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível listar itens";
				$("#erroModal").modal('show');
				return;
			}
			$("#buscaModal").modal('toggle');
		});
	}else{
		//console.log("O where da busca é: " + where);
		var argumentos = {
			selectCampos: ["TBBackup.*", "ti.nome tipoNome", "s.local setorLocal", "s.nome setorNome", "s.id setorId"], 
			joins: [
				{tabela: "TBTipoBackup ti", on: "ti.id = TBBackup.codTipoBackup"}, 
				{tabela: "TBLogTransferencia lt", on: "lt.codBackup = TBBackup.id"}, 
				{tabela: "TBSetor s", on: "s.id = lt.codSetor"}
			], 
			where: "lt.atual = 1 AND " + where, 
			orderBy: {campos: "patrimonio"}
		};
		
		utils.enviaRequisicao("Backup", "BUSCAR", {token: localStorage.token, msg: argumentos}, function(res){
			if(res.statusCode == 200){
				var msg = "";
				res.on('data', function(chunk){
					msg += chunk;
				});
				res.on('end', function(){
					let listaBackup = JSON.parse(msg);
					preencheTabela(listaBackup);
				});
			}else if(res.statusCode == 747){
				$("#tabelaBackup").empty();
			}else{
				document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível listar itens";
				$("#erroModal").modal('show');
				return;
			}
			$("#buscaModal").modal('toggle');
		});
	}
}

function preencheTabela(listaBackup){	
	if(!listaBackup){
		return;
	}
	$("#tabelaBackup").empty();
	for(let i = 0; i < listaBackup.length; i++){
		$("#tabelaBackup").append("\
		<tr>\
		    <th id='dataBackupLista"+ i +"'></th>\
		    <td>\
				<button class='btn btn-info mb-1' scope='row' data-toggle='collapse' href='#collapseBackupLista"+ i +"' role='button' aria-expanded='false' aria-controls='collapseExample'> Mostra Dados <span class='fas fa-plus'></span></button>\
				<button id='alterarBackupLista"+ i +"' class='btn btn-warning mb-1' data-toggle='modal' data-target='#alteraModal' >Alterar Backup</button>\
				<button id='excluirBackupLista"+ i +"' class='btn btn-danger mb-1' data-toggle='modal' data-target='#excluirModal'>Excluir Backup</button>\
				<div id='collapseBackupLista"+ i +"' class='collapse mostraLista' >\
				  <div class='card card-body'>\
				    <p><strong>Data: </strong><span id='dataBackupDados"+i+"'></span></p>\
				    <p><strong>Nome da pasta: </strong> <span id='nomePastaBackupDados"+i+"'></span></p>\
				    <p><strong>Tamanho: </strong> <span id='tamanhoBackupDados"+i+"'></span></p>\
				    <p><strong>Computador: </strong> <span id='computadorBackupDados"+i+"'></span></p>\
				    <p><strong>Disco de Backup: </strong> <span id='discoBackupDados"+i+"'></span></p>\
				    <p><strong>Observação: </strong> <span id='observacaoBackupDados"+i+"'></span></p>\
				  </div>\
				</div>\
		    </td>\
		  </tr>\
		");

		document.getElementById('dataBackupLista').innerHTML = listaBackup[i].data;
		document.getElementById('dataBackupDados').innerHTML = listaBackup[i].data;

		document.getElementById('nomePastaBackupDados').innerHTML = listaBackup[i].nomePasta;
		document.getElementById('tamanhoBackupDados').innerHTML = listaBackup[i].tamanho;
		document.getElementById('computadorBackupDados').innerHTML = listaBackup[i].patrimonioComputador;
		document.getElementById('discoBackupDados').innerHTML = listaBackup[i].nomeDisco;

		if(!listaBackup[i].observacao || listaBackup[i].observacao == ""){
			document.getElementById('observacaoBackupDados').innerHTML = '-';
		}else{
			document.getElementById('observacaoBackupDados').innerHTML = listaBackup[i].observacao;			
		}

		(function(){
			var backup = listaBackup[i];		
			document.getElementById("alterarBackupLista"+ i).addEventListener("click", function(){
				preencheModalAlterar(backup);
			}, false);
			document.getElementById("excluirBackupLista"+ i).addEventListener("click", function(){
				preencheModalExcluir(backup);
			}, false);
		}());
	}	
}

function preencheModalAlterar(backup){
	document.getElementById('dataBackupAlterar').value = backup.data;
	document.getElementById('nomePastaBackupAlterar').value = backup.nomePasta;
	document.getElementById('tamanhoBackupAlterar').value = backup.tamanho;
	document.getElementById('discoBackupAlterar').value = backup.codDisco;
	document.getElementById('idBackupAlterar').value = backup.id;
	document.getElementById('computadorBackupAlterar').value = backup.codComputador;
}

function preencheModalExcluir(backup){
	document.getElementById('dataBackupExcluir').innerHTML = backup.data;
	document.getElementById('idBackupExcluir').value = backup.id;
}

var utils = require('./../../utilsCliente.js');
buscaComputador(function(idComputador){
	if(!idComputador){
		document.getElementById('msgErroModal').innerHTML = "Não foi possível buscar computador";
		$("#erroModal").modal('show');
		return;
	}
	console.log("O ID do computador buscado é: " + idComputador);
	utils.enviaRequisicao("Backup", "LISTARCOMPUTADOR", {token: localStorage.token, msg: {idComputador: idComputador}}, function(res){
		if(res.statusCode == 200){
			var msg = "";
			res.on('data', function(chunk){
				msg += chunk;
			});
			res.on('end', function(){
				var vetorBackup = JSON.parse(msg);
				(function(){
					document.getElementById('btnResetLista').addEventListener('click', function(){preencheTabela(vetorBackup)}, false);
				}());
				preencheTabela(vetorBackup);
			});
		}else if(res.statusCode != 747){
			document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível listar itens";
			$("#erroModal").modal('show');
			return;
		}
	});
});
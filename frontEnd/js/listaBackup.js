document.getElementById('btnBuscar').addEventListener('click', buscar, false);
document.getElementById('btnLimparBusca').addEventListener('click', function(){
	document.getElementById('formBuscarBackup').reset();
}, false);

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

function buscar(){
	var utils = require('./../../utilsCliente.js');
	var where = "";

	if(document.getElementById('dataBackupBuscar').value != ""){
		let data = document.getElementById('dataBackupBuscar').value;
		let operador = utils.enumOperador(document.getElementById('argumentoDataBackupBuscar').value);

		if(where != "")
			where += " AND ";

		where += "data " + operador + " '" + data + "'";
	}

	if(document.getElementById('nomePastaBackupBuscar').value != ""){
		let nomePasta = document.getElementById('nomePastaBackupBuscar').value;

		if(where != "")
			where += " AND ";

		where += "nomePasta LIKE '%" + nomePasta + "%'";
	}

	if(document.getElementById('tamanhoBackupBuscar').value != ""){
		let tamanho = document.getElementById('tamanhoBackupBuscar').value;
		let operador = utils.enumOperador(document.getElementById('argumentoTamanhoBackupBuscar').value);

		if(where != "")
			where += " AND ";

		where += "b.tamanho " + operador + " " + tamanho;
	}

	if(document.getElementById('discoBackupBuscar').value != '0'){
		let disco = document.getElementById('discoBackupBuscar').value;

		if(where != "")
			where += " AND ";

		where += "codDisco = " + disco;
	}	

	if(where == ""){
		buscaComputador(function(idComputador){
			if(!idComputador){
				document.getElementById('msgErroModal').innerHTML = "Não foi possível buscar computador";
				$("#erroModal").modal('show');
				return;
			}
			utils.enviaRequisicao("Backup", "LISTARCOMPUTADOR", {token: localStorage.token, msg: {idComputador: idComputador}}, function(res){
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
					document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível listar backups";
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
			argumentos.orderBy = [{campo: "b.data", sentido: "DESC"}];
			argumentos.aliasTabela = "b";
			argumentos.selectCampos = ["b.*", "i.patrimonio patrimonioComputador", "d.nome discoNome"];
			argumentos.joins = [
				{tabela: "TBComputador c", on: "c.id = b.codComputador"},
				{tabela: "TBItem i", on: "i.id = c.codItem"},
				{tabela: "TBDiscoBackup d", on: "d.id = b.codDisco"}
			];
			
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
					document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível listar backups";
					$("#erroModal").modal('show');
					return;
				}
				$("#buscaModal").modal('toggle');
			});
		});
	}
}

function preencheAlterarDisco(){
	var select = document.getElementById('selectDiscoAlterar');
	if(select.value == '0'){
		document.getElementById('nomeDiscoAlterar').disabled = true;
		document.getElementById('localDiscoAlterar').disabled = true;
		document.getElementById('tamanhoDiscoAlterar').disabled = true;
		document.getElementById('observacaoDiscoAlterar').disabled = true;
		document.getElementById('formAlteraDisco').reset();
	}else{
		document.getElementById('nomeDiscoAlterar').disabled = false;
		document.getElementById('localDiscoAlterar').disabled = false;
		document.getElementById('tamanhoDiscoAlterar').disabled = false;
		document.getElementById('observacaoDiscoAlterar').disabled = false;

		require('./../../utilsCliente.js').enviaRequisicao('DiscoBackup', 'BUSCAR', {token: localStorage.token, msg: {where: "id = " + select.value}}, function(res){
			if(res.statusCode == 200){
				var msg = "";
				res.on('data', function(chunk){
					msg += chunk;
				});
				res.on('end', function(){
					var disco = JSON.parse(msg)[0];
					document.getElementById('nomeDiscoAlterar').value = disco.nome;
					document.getElementById('localDiscoAlterar').value = disco.local;
					document.getElementById('tamanhoDiscoAlterar').value = disco.tamanho;
					document.getElementById('observacaoDiscoAlterar').value = disco.observacao;
				});
			}else{
				document.getElementById('msgErroModal').innerHTML = "Não foi possível buscar dados deste disco";
				$("#erroModal").modal('show');
				return;
			}
		});
	}
}

function preencheDisco(){
	require('./../../utilsCliente.js').enviaRequisicao("DiscoBackup", "LISTAR", {token: localStorage.token}, function(res){
		if(res.statusCode == 200){
			var msg = "";
			res.on('data', function(chunk){
				msg += chunk;
			});
			res.on('end', function(){
				var vetorDisco = JSON.parse(msg);

				$("#discoBackupCadastrar > option").remove();
				$("#discoBackupAlterar > option").remove();
				$("#discoBackupBuscar > option").remove();
				$("#selectDiscoAlterar > option").remove();

				$("#discoBackupCadastrar").append("<option value='0'>Disco de Backup</option>");
				$("#discoBackupBuscar").append("<option value='0'>Disco de Backup</option>");
				$("#discoBackupAlterar").append("<option value='0'>Disco de Backup</option>");
				$("#selectDiscoAlterar").append("<option value='0'>Selecione o disco a ser alterado</option>");

				for(let i = 0; i < vetorDisco.length; i++){
					$("#discoBackupCadastrar").append("<option value='"+vetorDisco[i].id+"'>"+vetorDisco[i].nome+"</option>");
					$("#discoBackupAlterar").append("<option value='"+vetorDisco[i].id+"'>"+vetorDisco[i].nome+"</option>");
					$("#discoBackupBuscar").append("<option value='"+vetorDisco[i].id+"'>"+vetorDisco[i].nome+"</option>");
					$("#selectDiscoAlterar").append("<option value='"+vetorDisco[i].id+"'>"+vetorDisco[i].nome+"</option>");
				}
				preencheAlterarDisco();
			});
		}else if(res.statusCode != 747){
			document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível listar discos de backup";
			$("#erroModal").modal('show');
			return;
		}
	});
}

function preencheTabela(listaBackup){	
	if(!listaBackup){
		return;
	}
	
	var utils = require('./../../utilsCliente.js');

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
				    <p><strong>Disco de Backup: </strong> <span id='discoBackupDados"+i+"'></span></p>\
				    <p><strong>Nome da pasta: </strong> <span id='nomePastaBackupDados"+i+"'></span></p>\
				    <p><strong>Tamanho: </strong> <span id='tamanhoBackupDados"+i+"'></span></p>\
				    <p><strong>Computador: </strong> <span id='computadorBackupDados"+i+"'></span></p>\
				    <p><strong>Observação: </strong> <span id='observacaoBackupDados"+i+"'></span></p>\
				  </div>\
				</div>\
		    </td>\
		  </tr>\
		");

		document.getElementById('dataBackupLista' + i).innerHTML = utils.formataDataHora(listaBackup[i].data);
		document.getElementById('dataBackupDados' + i).innerHTML = utils.formataDataHora(listaBackup[i].data);

		document.getElementById('nomePastaBackupDados' + i).innerHTML = listaBackup[i].nomePasta;
		document.getElementById('tamanhoBackupDados' + i).innerHTML = listaBackup[i].tamanho + " MB";
		document.getElementById('computadorBackupDados' + i).innerHTML = listaBackup[i].patrimonioComputador;
		document.getElementById('discoBackupDados' + i).innerHTML = listaBackup[i].discoNome;

		if(!listaBackup[i].observacao || listaBackup[i].observacao == ""){
			document.getElementById('observacaoBackupDados' + i).innerHTML = '-';
		}else{
			document.getElementById('observacaoBackupDados' + i).innerHTML = listaBackup[i].observacao;			
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
	document.getElementById('dataBackupAlterar').value = backup.data.substring(0, 16);
	document.getElementById('nomePastaBackupAlterar').value = backup.nomePasta;
	document.getElementById('tamanhoBackupAlterar').value = backup.tamanho;
	document.getElementById('discoBackupAlterar').value = backup.codDisco;
	document.getElementById('idBackupAlterar').value = backup.id;
	document.getElementById('computadorBackupAlterar').value = backup.codComputador;
	if(backup.observacao)
		document.getElementById('observacaoBackupAlterar').value = backup.observacao;
}

function preencheModalExcluir(backup){
	document.getElementById('dataBackupExcluir').innerHTML = require('./../../utilsCliente.js').formataDataHora(backup.data);
	document.getElementById('idBackupExcluir').value = backup.id;
}


preencheDisco();
var utils = require('./../../utilsCliente.js');
buscaComputador(function(idComputador){
	if(!idComputador){
		document.getElementById('msgErroModal').innerHTML = "Não foi possível buscar computador";
		$("#erroModal").modal('show');
		return;
	}
	// console.log("O ID do computador buscado é: " + idComputador);
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
document.getElementById('btnBuscar').addEventListener('click', buscar, false);
document.getElementById('btnLimparBusca').addEventListener('click', function(){
	document.getElementById('formBuscarItem').reset();
}, false);
document.getElementById('btnAcaoItem').addEventListener('click', lote, false);

document.getElementById('localItemCadastrar').addEventListener('change', function(){
	preencheSetor(document.getElementById('localItemCadastrar').value, "setorItemCadastrar");
}, false);
document.getElementById('localItemBuscar').addEventListener('change', function(){
	preencheSetor(document.getElementById('localItemBuscar').value, "setorItemBuscar");
}, false);
document.getElementById('localItemTransferir').addEventListener('change', function(){
	preencheSetor(document.getElementById('localItemTransferir').value, "setorItemTransferir");
}, false);
document.getElementById('localLoteTransferir').addEventListener('change', function(){
	preencheSetor(document.getElementById('localLoteTransferir').value, "setorLoteTransferir");
}, false);

document.getElementById('semPatrimonioItemCadastrar').addEventListener('change', function(){
	if(document.getElementById('semPatrimonioItemCadastrar').checked == true){
		document.getElementById('patrimonioItemCadastrar').disabled = true;
	}else{
		document.getElementById('patrimonioItemCadastrar').disabled = false;
	}
}, false);

document.getElementById('semPatrimonioItemAlterar').addEventListener('change', function(){
	if(document.getElementById('semPatrimonioItemAlterar').checked == true){
		document.getElementById('patrimonioItemAlterar').disabled = true;
	}else{
		document.getElementById('patrimonioItemAlterar').disabled = false;
	}
}, false);

function lote(){
	var selecao = document.getElementById('selectAcaoItem').value;
	if(selecao === 'transferir'){
		//Passar com for por todos os registros, guardar os patrimônios marcados, mostrar no campo disabled separado por vírgula (?), selecionar o setor de destino, iniciar o multItem
		//Fazer uma função no controller de LogTransferencia para itens multiplos, que além do retorno numerico também retorna em texto os patrimonios que não foram transferidos porque o setor de destino é igual à origem
		//Se possível fazer essa validação primeiro a nível cliente e depois a nível servidor
		var vetorMarcados = [];
		var vetorID = [];
		for(let i = 0; true; i++){
			var cboxAtual = document.getElementById('cboxItemLista' + i);
			if(cboxAtual == null)
				break;

			if(cboxAtual.checked == true){
				vetorMarcados.push(i);
				vetorID.push(cboxAtual.value);
			}
		}

		if(vetorMarcados.length == 0){
			document.getElementById('msgErroModal').innerHTML = "Selecione ao menos um item!";
			$("#erroModal").modal('show');
			return;
		}else if(vetorMarcados.length == 1){
			document.getElementById('patrimonioItemTransferir').value = document.getElementById('patrimonioItemDados' + vetorMarcados[0]).innerHTML;
			document.getElementById('localItemTransferir').value = document.getElementById('idLocalItemDados' + vetorMarcados[0]).value;
			preencheSetor(document.getElementById('idLocalItemDados' + vetorMarcados[0]).value, "setorItemTransferir", function(){
				document.getElementById('setorItemTransferir').value = document.getElementById('idSetorItemDados' + vetorMarcados[0]).value;
			});
			document.getElementById('idItemTransferir').value = document.getElementById('cboxItemLista' + vetorMarcados[0]).value;
			document.getElementById('setorAntigoItemTransferir').value = document.getElementById('setorItemDados' + vetorMarcados[0]).innerHTML;
			document.getElementById('idSetorAntigoItemTransferir').value = document.getElementById('idSetorItemDados' + vetorMarcados[0]).value;
			document.getElementById('localAntigoItemTransferir').value = document.getElementById('localItemDados' + vetorMarcados[0]).innerHTML;
			document.getElementById('idLocalAntigoItemTransferir').value = document.getElementById('idLocalItemDados' + vetorMarcados[0]).value;

			$("#transfereModal").modal('show');
		}else{
			document.getElementById('patrimonioLoteTransferir').value = "";
			for(let i = 0; i < vetorMarcados.length; i++){
				if(i < vetorMarcados.length - 1)
					document.getElementById('patrimonioLoteTransferir').value = document.getElementById('patrimonioLoteTransferir').value + document.getElementById('patrimonioItemDados' + vetorMarcados[i]).innerHTML + ", ";
				else
					document.getElementById('patrimonioLoteTransferir').value = document.getElementById('patrimonioLoteTransferir').value + document.getElementById('patrimonioItemDados' + vetorMarcados[i]).innerHTML;				
			}
			document.getElementById('idItemTransferirLote').value = JSON.stringify(vetorID);
			preencheSetor(document.getElementById('localLoteTransferir').value, "setorLoteTransferir");
			$("#transfereLoteModal").modal('show');			
		}

	}
}

function buscar(){
	var utils = require('./../../utilsCliente.js');
	var where = "";

	if(document.getElementById('patrimonioItemBuscar').value != ""){
		let patrimonio = document.getElementById('patrimonioItemBuscar').value;

		while(patrimonio.length < 6){
			patrimonio = "0" + patrimonio;
		}

		if(where != "")
			where += " AND ";

		where += "patrimonio = '" + patrimonio + "'";
	}

	if(document.getElementById('marcaItemBuscar').value != ""){
		let marca = document.getElementById('marcaItemBuscar').value;

		if(where != "")
			where += " AND ";

		where += "marca LIKE '%" + marca + "%'";
	}

	if(document.getElementById('modeloItemBuscar').value != ""){
		let modelo = document.getElementById('modeloItemBuscar').value;

		if(where != "")
			where += " AND ";

		where += "modelo LIKE '%" + modelo + "%'";
	}

	if(document.getElementById('localItemBuscar').value != '0'){
		let local = document.getElementById('localItemBuscar').value;

		if(where != "")
			where += " AND ";

		where += "lt.codLocal = " + local;
	}	

	if(document.getElementById('setorItemBuscar').value != '0'){
		let setor = document.getElementById('setorItemBuscar').value;

		if(where != "")
			where += " AND ";

		where += "codSetor = " + setor;
	}

	if(document.getElementById('tipoItemBuscar').value != '0'){
		let tipo = document.getElementById('tipoItemBuscar').value;

		if(where != "")
			where += " AND ";

		where += "codTipoItem = " + tipo;
	}

	if(document.getElementById('ativoItemBuscar').checked == true){
		if(where != ""){
			where += " AND ";
		}

		where += "(ativo = 1 or ativo = 0)";
	}else{
		if(where != ""){
			where += " AND ";
		}

		where += "ativo = 1";
	}

	if(where == ""){
		utils.enviaRequisicao("Item", "LISTAR", {token: localStorage.token}, function(res){
			if(res.statusCode == 200){
				var msg = "";
				res.on('data', function(chunk){
					msg += chunk;
				});
				res.on('end', function(){
					let listaItem = JSON.parse(require('./../../utilsCliente.js').descriptoAES(localStorage.chave, msg));
					preencheTabela(listaItem);
				});
			}else if(res.statusCode == 747){
				$("#tabelaItem").empty();
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
			selectCampos: ["TBItem.*", "ti.nome tipoNome", "l.nome localNome", "s.nome setorNome", "s.id setorId"], 
			joins: [
				{tabela: "TBTipoItem ti", on: "ti.id = TBItem.codTipoItem"}, 
				{tabela: "TBLogTransferencia lt", on: "lt.codItem = TBItem.id"}, 
				{tabela: "TBSetor s", on: "s.id = lt.codSetor", tipo: "LEFT"},
				{tabela: "TBLocal l", on: "l.id = lt.codLocal"}
			], 
			where: "lt.atual = 1 AND " + where, 
			orderBy: [{campo: "patrimonio", sentido: "asc"}]
		};
		
		utils.enviaRequisicao("Item", "BUSCAR", {token: localStorage.token, msg: argumentos}, function(res){
			if(res.statusCode == 200){
				var msg = "";
				res.on('data', function(chunk){
					msg += chunk;
				});
				res.on('end', function(){
					let listaItem = JSON.parse(require('./../../utilsCliente.js').descriptoAES(localStorage.chave, msg));
					preencheTabela(listaItem);
				});
			}else if(res.statusCode == 747){
				$("#tabelaItem").empty();
			}else{
				document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível listar itens";
				$("#erroModal").modal('show');
				return;
			}
			$("#buscaModal").modal('toggle');
		});
	}
}

function preencheCopiarItem(listaItem){
	$("#copiarItemCadastrar > option").remove();
	$("#copiarItemCadastrar").append("<option value='0'>Selecione um item com as mesmas características (opcional)</option>");
	
	for(let i = 0; i < listaItem.length; i++){
		$("#copiarItemCadastrar").append("<option value='"+listaItem[i].id+"'>"+listaItem[i].patrimonio+"</option>");
	}
}

function preencheTabela(listaItem){	
	if(!listaItem){
		return;
	}
	$("#tabelaItem").empty();
	for(let i = 0; i < listaItem.length; i++){
		$("#tabelaItem").append("\
		<tr>\
			<td><input id='cboxItemLista" + i + "' type='checkbox'></td>\
		    <th id='patrimonioItemLista"+ i +"'></th>\
		    <td>\
				<button class='btn btn-info mb-1' scope='row' data-toggle='collapse' href='#collapseItemLista"+ i +"' role='button' aria-expanded='false' aria-controls='collapseExample'> Mostra Dados <span class='fas fa-plus'></span></button>\
				<button id='alterarItemLista"+ i +"' class='btn btn-warning mb-1' data-toggle='modal' data-target='#alteraModal' >Alterar Item</button>\
				<button id='excluirItemLista"+ i +"' class='btn btn-danger mb-1' data-toggle='modal' data-target='#excluirModal'>Excluir Item</button>\
				<button id='transferirItemLista"+ i +"' class='btn btn-success mb-1' data-toggle='modal' data-target='#transfereModal'>Transferir Item</button>\
				<div id='collapseItemLista"+ i +"' class='collapse mostraLista' >\
				  <div class='card card-body'>\
				    <p><strong>Patrimônio: </strong><span id='patrimonioItemDados"+i+"'></span></p>\
				    <p><strong>Marca: </strong> <span id='marcaItemDados"+i+"'></span></p>\
				    <p><strong>Modelo: </strong> <span id='modeloItemDados"+i+"'></span></p>\
				    <p><strong>Descrição: </strong> <span id='descricaoItemDados"+i+"'></span></p>\
				    <p><strong>Tipo: </strong> <span id='tipoItemDados"+i+"'></span></p>\
				    <p><strong>Local: </strong> <span id='localItemDados"+i+"'></span></p>\
				    <p><strong>Setor: </strong> <span id='setorItemDados"+i+"'></span></p>\
				    <div style='display: none;' id='idLocalItemDados"+i+"'></div>\
				    <div style='display: none;' id='idSetorItemDados"+i+"'></div>\
				    <br>\
				    <button class='btn btn-info mb-1' id='historicoItemDados"+i+"'>Ver Histórico de Movimentações</button>\
				  </div>\
				</div>\
		    </td>\
		  </tr>\
		");

		if(listaItem[i].patrimonio == '000000'){
			listaItem[i].patrimonio = "S/P";
		}

		document.getElementById('cboxItemLista' + i).value = listaItem[i].id;
		document.getElementById('patrimonioItemLista' + i).innerHTML = listaItem[i].tipoNome + " - " + listaItem[i].patrimonio;
		document.getElementById('patrimonioItemDados' + i).innerHTML = listaItem[i].patrimonio;
		if(listaItem[i].marca)
			document.getElementById('marcaItemDados' + i).innerHTML = listaItem[i].marca;
		else
			document.getElementById('marcaItemDados' + i).innerHTML = "-";
		if(listaItem[i].modelo)
			document.getElementById('modeloItemDados' + i).innerHTML = listaItem[i].modelo;
		else
			document.getElementById('modeloItemDados' + i).innerHTML = "-";
		if(listaItem[i].descricao != " " && listaItem[i].descricao != "")
			document.getElementById('descricaoItemDados' + i).innerHTML = listaItem[i].descricao;
		else
			document.getElementById('descricaoItemDados' + i).innerHTML = "-";

		document.getElementById('tipoItemDados' + i).innerHTML = listaItem[i].tipoNome;

		document.getElementById('localItemDados' + i).innerHTML = listaItem[i].localNome;		

		if(listaItem[i].setorNome)
			document.getElementById('setorItemDados' + i).innerHTML = listaItem[i].setorNome;
		else
			document.getElementById('setorItemDados' + i).innerHTML = "Não definido";			

		document.getElementById('idLocalItemDados' + i).value = listaItem[i].localId;
		document.getElementById('idSetorItemDados' + i).value = listaItem[i].setorId;

		(function(){
			var item = listaItem[i];		
			document.getElementById("alterarItemLista"+ i).addEventListener("click", function(){
				preencheModalAlterar(item);
			}, false);
			document.getElementById("excluirItemLista"+ i).addEventListener("click", function(){
				preencheModalExcluir(item);
			}, false);
			document.getElementById("transferirItemLista" + i).addEventListener("click", function(){
				preencheModalTransferencia(item);
			}, false);
			document.getElementById("historicoItemDados" + i).addEventListener("click", function(){
				preencheModalHistorico(item);
			}, false);
		}());
	}	
}

function preencheModalAlterar(item){
	document.getElementById('patrimonioItemAlterar').value = item.patrimonio;
	document.getElementById('marcaItemAlterar').value = item.marca;
	document.getElementById('modeloItemAlterar').value = item.modelo;
	document.getElementById('descricaoItemAlterar').value = item.descricao;
	document.getElementById('tipoItemAlterar').value = item.codTipoItem;
	document.getElementById('idItemAlterar').value = item.id;
}

function preencheModalExcluir(item){
	document.getElementById('patrimonioItemExcluir').innerHTML = item.tipoNome + " - " + item.patrimonio;
	document.getElementById('idItemExcluir').value = item.id;
}

function preencheModalTransferencia(item){
	document.getElementById('setorItemTransferir').disabled = true;
	document.getElementById('patrimonioItemTransferir').value = item.patrimonio;
	document.getElementById('localItemTransferir').value = item.localId;
	preencheSetor(item.localId, "setorItemTransferir", function(){
		if(item.setorId)
			document.getElementById('setorItemTransferir').value = item.setorId;
		else
			document.getElementById('setorItemTransferir').value = '0';			
	});
	document.getElementById('idItemTransferir').value = item.id;
	document.getElementById('setorAntigoItemTransferir').value = item.setorNome;
	document.getElementById('idSetorAntigoItemTransferir').value = item.setorId;
	document.getElementById('localAntigoItemTransferir').value = item.localNome;
	document.getElementById('idLocalAntigoItemTransferir').value = item.localId;
}

function preencheModalHistorico(item){
	document.getElementById('patrimonioHistorico').innerHTML = item.patrimonio;
	require('./../../utilsCliente.js').enviaRequisicao('LogTransferencia', 'BUSCAR', {token: localStorage.token, msg: {aliasTabela: "lt", selectCampos: ["s.nome nomeSetor", "l.nome nomeLocal", "s.sigla siglaSetor", "lt.data dataTransferencia"], joins: [{tabela: "TBSetor s", on: "s.id = lt.codSetor", tipo: "LEFT"}, {tabela: "TBLocal l", on: "l.id = lt.codLocal"}], where: "codItem = " + item.id, orderBy: [{campo: "data", sentido: "DESC"}]}}, function(res){
		if(res.statusCode == 200){
			var msg = "";
			res.on('data', function(chunk){
				msg += chunk;
			});
			res.on('end', function(){
				let historico = JSON.parse(require('./../../utilsCliente.js').descriptoAES(localStorage.chave, msg));
				$("#corpoHistoricoModal >").remove();
				for(let i = 0; i < historico.length; i++){
					let localTemp;
					if(historico[i].nomeSetor){
						localTemp = historico[i].nomeLocal + ' - ' + historico[i].nomeSetor;
					}else{
						localTemp = historico[i].nomeLocal + ' -  Sem Setor';
					}
					$("#corpoHistoricoModal").append('<div class="card mb-1" style="width: 100%;">\
					    <div class="card-body">\
					      <h5 class="card-title">' + localTemp + '</h5>\
					      <p class="card-text">Data de Transferência: ' + require('./../../utilsCliente.js').formataDataHora(historico[i].dataTransferencia) + '</p>\
					    </div>\
					  </div>');
					// console.log("Data sem formatar: " + historico[i].dataTransferencia);
					// console.log("Data formatada: " + require('./../../utilsCliente.js').formataDataHora(historico[i].dataTransferencia))
				}
				$("#historicoModal").modal('show');
			});
		}else{
			document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível listar histórico do item";
			$("#erroModal").modal('show');
			return;
		}
	});
}

function preencheTipo(){
	var utils = require('./../../utilsCliente.js');
	utils.enviaRequisicao("TipoItem", "LISTAR", {token: localStorage.token}, function(res){
		if(res.statusCode == 200){
			var msg = "";
			res.on('data', function(chunk){
				msg += chunk;
			});
			res.on('end', function(){
				var vetorTipo = JSON.parse(require('./../../utilsCliente.js').descriptoAES(localStorage.chave, msg));
				$("#tipoItemCadastrar > option").remove();
				$("#tipoItemAlterar > option").remove();
				$("#selectTipoAlterar > option").remove();
				$("#tipoItemBuscar > option").remove();

				$("#tipoItemCadastrar").append("<option value='0'>Tipo</option");
				$("#tipoItemAlterar").append("<option value='0'>Tipo</option");
				$("#selectTipoAlterar").append("<option value='0'>Selecione o tipo a ser alterado/excluído</option");
				$("#tipoItemBuscar").append("<option value='0'>Tipo</option");


				for(let i = 0; i < vetorTipo.length; i++){
					$("#tipoItemCadastrar").append("<option value='"+vetorTipo[i].id+"'>"+vetorTipo[i].nome+"</option");
					$("#tipoItemAlterar").append("<option value='"+vetorTipo[i].id+"'>"+vetorTipo[i].nome+"</option");
					$("#selectTipoAlterar").append("<option value='"+vetorTipo[i].id+"'>"+vetorTipo[i].nome+"</option");
					$("#tipoItemBuscar").append("<option value='"+vetorTipo[i].id+"'>"+vetorTipo[i].nome+"</option");
				}
			});
		}else if(res.statusCode != 747){
			document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível listar tipos de item";
			$("#erroModal").modal('show');
			return;
		}
	});
}

function preencheLocal(){
	var utils = require('./../../utilsCliente.js');
	utils.enviaRequisicao("Local", "LISTAR", {token: localStorage.token}, function(res){
		if(res.statusCode == 200){
			var msg = "";
			res.on('data', function(chunk){
				msg += chunk;
			});
			res.on('end', function(){
				var vetorLocal = JSON.parse(require('./../../utilsCliente.js').descriptoAES(localStorage.chave, msg));
				$("#localItemCadastrar > option").remove();
				$("#localItemBuscar > option").remove();
				$("#localItemTransferir > option").remove();
				$("#localLoteTransferir > option").remove();
				
				$("#localItemCadastrar").append("<option value='0'>Local</option");
				$("#localItemBuscar").append("<option value='0'>Local</option");


				for(let i = 0; i < vetorLocal.length; i++){
					$("#localItemCadastrar").append("<option value='"+vetorLocal[i].id+"'>" + vetorLocal[i].nome + "</option");
					$("#localItemBuscar").append("<option value='"+vetorLocal[i].id+"'>" + vetorLocal[i].nome + "</option");
					$("#localItemTransferir").append("<option value='"+vetorLocal[i].id+"'>" + vetorLocal[i].nome + "</option");
					$("#localLoteTransferir").append("<option value='"+vetorLocal[i].id+"'>" + vetorLocal[i].nome + "</option");
				}
			});
		}else if(res.statusCode != 747){
			document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível listar locais";
			$("#erroModal").modal('show');
			return;
		}
	});
}

function preencheSetor(local, select, cb){
	if(local == '0'){
		document.getElementById(select).disabled = true;
		return;
	}
	document.getElementById(select).disabled = false;
	var utils = require('./../../utilsCliente.js');
	utils.enviaRequisicao("Setor", "BUSCAR", {token: localStorage.token, msg: {where: "codLocal = " + local, orderBy: [{campo: "nome", sentido: "asc"}]}}, function(res){
		if(res.statusCode == 200){
			var msg = "";
			res.on('data', function(chunk){
				msg += chunk;
			});
			res.on('end', function(){
				var vetorSetor = JSON.parse(require('./../../utilsCliente.js').descriptoAES(localStorage.chave, msg));
				
				$("#" + select + " > option").remove();				
				$("#" + select).append("<option value='0'>Sem setor</option");

				for(let i = 0; i < vetorSetor.length; i++){
					$("#" + select).append("<option value='"+vetorSetor[i].id+"'>" + vetorSetor[i].nome + "</option");					
				}
				if(cb){
					cb();
				}
			});
		}else if(res.statusCode != 747){
			document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível listar setores";
			$("#erroModal").modal('show');
			return;
		}
	});
}

//Parte do computador

function preencheCopiarComputador(){
	var listaComputador;
	require('./../../utilsCliente.js').enviaRequisicao("Computador", "LISTAR", {token: localStorage.token}, function(res){
		if(res.statusCode == 200){
			let msg = "";
			res.on('data', function(chunk){
				msg += chunk;
			});
			res.on('end', function(){
				listaComputador = JSON.parse(require('./../../utilsCliente.js').descriptoAES(localStorage.chave, msg));
				$("#copiarComputadorCadastrar > option").remove();
				$("#copiarComputadorCadastrar").append("<option value='0'>Selecione um computador com as mesmas características (opcional)</option>");
				
				for(let i = 0; i < listaComputador.length; i++){
					$("#copiarComputadorCadastrar").append("<option value='"+listaComputador[i].id+"'>"+listaComputador[i].itemPatrimonio+"</option>");
				}
			});
		}else if(res.statusCode != 747){
			document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível buscar computador para cópia";
			$("#erroModal").modal('show');
			return;		
		}
	});	
}


function preencheProcessador(){
	require('./../../utilsCliente.js').enviaRequisicao("Processador", "LISTAR", {token: localStorage.token}, function(res){
		if(res.statusCode == 200){
			var msg = "";
			res.on('data', function(chunk){
				msg += chunk;
			});
			res.on('end', function(){
				var vetorProcessador = JSON.parse(require('./../../utilsCliente.js').descriptoAES(localStorage.chave, msg));
				$("#processadorComputadorCadastrar > option").remove();
				$("#selectProcessadorAlterar > option").remove();

				$("#processadorComputadorCadastrar").append("<option value='0'>Processador</option>");
				$("#selectProcessadorAlterar").append("<option value='0'>Selecione um processador para alterar</option>");

				for(let i = 0; i < vetorProcessador.length; i++){
					$("#processadorComputadorCadastrar").append("<option value='" + vetorProcessador[i].id + "'>" + vetorProcessador[i].nome + "</option>");
					$("#selectProcessadorAlterar").append("<option value='" + vetorProcessador[i].id + "'>" + vetorProcessador[i].nome + "</option>");
				}
			});
		}else if(res.statusCode != 747){
			document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível buscar processadores";
			$("#erroModal").modal('show');
			return;
		}
	});
}

function preencheSO(){
	require('./../../utilsCliente.js').enviaRequisicao("SistemaOperacional", "LISTAR", {token: localStorage.token}, function(res){
		if(res.statusCode == 200){
			var msg = "";
			res.on('data', function(chunk){
				msg += chunk;
			});
			res.on('end', function(){
				var vetorSO = JSON.parse(require('./../../utilsCliente.js').descriptoAES(localStorage.chave, msg));
				$("#sistemaComputadorCadastrar > option").remove();
				$("#selectSOAlterar > option").remove();

				$("#sistemaComputadorCadastrar").append("<option value='0'>Sistema Operacional</option>");
				$("#selectSOAlterar").append("<option value='0'>Selecione um SO para alterar</option>");			

				for(let i = 0; i < vetorSO.length; i++){
					$("#sistemaComputadorCadastrar").append("<option value='" + vetorSO[i].id + "'>" + vetorSO[i].nome + "</option>");
					$("#selectSOAlterar").append("<option value='" + vetorSO[i].id + "'>" + vetorSO[i].nome + "</option>");				
				}
			});
		}else if(res.statusCode != 747){
			document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível buscar processadores";
			$("#erroModal").modal('show');
			return;
		}
	});
}

preencheTipo();
preencheLocal();
preencheCopiarComputador();
preencheProcessador();
preencheSO();
var utils = require('./../../utilsCliente.js');
utils.enviaRequisicao("Item", "LISTAR", {token: localStorage.token}, function(res){
	if(res.statusCode == 200){
		var msg = "";
		res.on('data', function(chunk){
			msg += chunk;
		});
		res.on('end', function(){
			var vetorItem = JSON.parse(require('./../../utilsCliente.js').descriptoAES(localStorage.chave, msg));
			(function(){
				document.getElementById('btnResetLista').addEventListener('click', function(){preencheTabela(vetorItem)}, false);
			}());
			preencheTabela(vetorItem);
			preencheCopiarItem(vetorItem);
		});
	}else if(res.statusCode != 747){
		document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível listar itens";
		$("#erroModal").modal('show');
		return;
	}
});
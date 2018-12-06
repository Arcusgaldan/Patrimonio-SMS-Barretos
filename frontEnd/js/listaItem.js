document.getElementById('btnBuscar').addEventListener('click', buscar, false);
document.getElementById('btnLimparBusca').addEventListener('click', function(){
	document.getElementById('formBuscarItem').reset();
}, false);

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

	if(where == ""){
		utils.enviaRequisicao("Item", "LISTAR", {token: localStorage.token}, function(res){
			if(res.statusCode == 200){
				var msg = "";
				res.on('data', function(chunk){
					msg += chunk;
				});
				res.on('end', function(){
					let listaItem = JSON.parse(msg);
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
			selectCampos: ["TBItem.*", "ti.nome tipoNome", "s.local setorLocal", "s.nome setorNome", "s.id setorId"], 
			joins: [
				{tabela: "TBTipoItem ti", on: "ti.id = TBItem.codTipoItem"}, 
				{tabela: "TBLogTransferencia lt", on: "lt.codItem = TBItem.id"}, 
				{tabela: "TBSetor s", on: "s.id = lt.codSetor"}
			], 
			where: "lt.atual = 1 AND " + where, 
			orderBy: {campos: "patrimonio"}
		};
		
		utils.enviaRequisicao("Item", "BUSCAR", {token: localStorage.token, msg: argumentos}, function(res){
			if(res.statusCode == 200){
				var msg = "";
				res.on('data', function(chunk){
					msg += chunk;
				});
				res.on('end', function(){
					let listaItem = JSON.parse(msg);
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

function preencheTabela(listaItem){	
	if(!listaItem){
		return;
	}
	$("#tabelaItem").empty();
	for(let i = 0; i < listaItem.length; i++){
		$("#tabelaItem").append("\
		<tr>\
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
				    <p><strong>Setor: </strong> <span id='setorItemDados"+i+"'></span></p>\
				  </div>\
				</div>\
		    </td>\
		  </tr>\
		");

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

		document.getElementById('setorItemDados' + i).innerHTML = listaItem[i].setorLocal + " - " + listaItem[i].setorNome;

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
	document.getElementById('patrimonioItemTransferir').value = item.patrimonio;
	document.getElementById('setorItemTransferir').value = item.setorId;
	document.getElementById('idItemTransferir').value = item.id;
	document.getElementById('setorAntigoItemTransferir').value = item.setorLocal + " - " + item.setorNome;
	document.getElementById('idSetorAntigoItemTransferir').value = item.setorId;
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
				var vetorTipo = JSON.parse(msg);
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

function preencheSetor(){
	var utils = require('./../../utilsCliente.js');
	utils.enviaRequisicao("Setor", "LISTAR", {token: localStorage.token}, function(res){
		if(res.statusCode == 200){
			var msg = "";
			res.on('data', function(chunk){
				msg += chunk;
			});
			res.on('end', function(){
				var vetorSetor = JSON.parse(msg);
				$("#setorItemCadastrar > option").remove();
				$("#setorItemBuscar > option").remove();
				$("#setorItemTransferir > option").remove();
				
				$("#setorItemCadastrar").append("<option value='0'>Setor</option");
				$("#setorItemBuscar").append("<option value='0'>Setor</option");


				for(let i = 0; i < vetorSetor.length; i++){
					$("#setorItemCadastrar").append("<option value='"+vetorSetor[i].id+"'>" + vetorSetor[i].local + " - " + vetorSetor[i].nome+"</option");
					$("#setorItemBuscar").append("<option value='"+vetorSetor[i].id+"'>" + vetorSetor[i].local + " - " + vetorSetor[i].nome+"</option");
					$("#setorItemTransferir").append("<option value='"+vetorSetor[i].id+"'>" + vetorSetor[i].local + " - " + vetorSetor[i].nome+"</option");
				}
			});
		}else if(res.statusCode != 747){
			document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível listar setores";
			$("#erroModal").modal('show');
			return;
		}
	});
}

preencheTipo();
preencheSetor();
var utils = require('./../../utilsCliente.js');
utils.enviaRequisicao("Item", "LISTAR", {token: localStorage.token}, function(res){
	if(res.statusCode == 200){
		var msg = "";
		res.on('data', function(chunk){
			msg += chunk;
		});
		res.on('end', function(){
			var vetorItem = JSON.parse(msg);
			(function(){
				document.getElementById('btnResetLista').addEventListener('click', function(){preencheTabela(vetorItem)}, false);
			}());
			preencheTabela(vetorItem);
		});
	}else if(res.statusCode != 747){
		document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível listar itens";
		$("#erroModal").modal('show');
		return;
	}
});
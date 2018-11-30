function preencheTabela(listaItem){	
	if(!listaItem){
		return;
	}
	for(let i = 0; i < listaItem.length; i++){
		$("#tabelaItem").append("\
		<tr>\
		    <th id='patrimonioItemLista"+ i +"'></th>\
		    <td>\
				<button class='btn btn-info' scope='row' data-toggle='collapse' href='#collapseItemLista"+ i +"' role='button' aria-expanded='false' aria-controls='collapseExample'> Mostra Dados <span class='fas fa-plus'></span></button>\
				<button id='alterarItemLista"+ i +"' class='btn btn-warning' data-toggle='modal' data-target='#alteraModal' >Alterar Item</button>\
				<button id='excluirItemLista"+ i +"' class='btn btn-danger' data-toggle='modal' data-target='#excluirModal'>Excluir Item</button>\
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
		if(listaItem[i].descricao)
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

				$("#tipoItemCadastrar").append("<option value='0'>Tipo</option");
				$("#tipoItemAlterar").append("<option value='0'>Tipo</option");
				$("#selectTipoAlterar").append("<option value='0'>Selecione o tipo a ser alterado/excluído</option");
				for(let i = 0; i < vetorTipo.length; i++){
					$("#tipoItemCadastrar").append("<option value='"+vetorTipo[i].id+"'>"+vetorTipo[i].nome+"</option");
					$("#tipoItemAlterar").append("<option value='"+vetorTipo[i].id+"'>"+vetorTipo[i].nome+"</option");
					$("#selectTipoAlterar").append("<option value='"+vetorTipo[i].id+"'>"+vetorTipo[i].nome+"</option");
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
				$("#setorItemCadastrar").append("<option value='0'>Setor</option");

				for(let i = 0; i < vetorSetor.length; i++){
					$("#setorItemCadastrar").append("<option value='"+vetorSetor[i].id+"'>" + vetorSetor[i].local + " - " + vetorSetor[i].nome+"</option");
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
			preencheTabela(vetorItem);
		});
	}else if(res.statusCode != 747){
		document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível listar itens";
		$("#erroModal").modal('show');
		return;
	}
});
function preencheTabela(listaItem){
	// var utils = require('./../../utilsCliente.js');
	// utils.enviaRequisicao("TipoItem", "LISTAR", "", function(res){
	// 	if(res.statusCode == 200){
	// 		var msg = "";
	// 		res.on('data', function(chunk){
	// 			msg += chunk;
	// 		});
	// 		res.on('end', function(){
	// 			var vetorTipo = JSON.parse(msg);
	// 			var vetorTipoOrganizado = [];
	// 			for(let i = 0; i < vetorTipo.length; i++){
	// 				vetorTipoOrganizado[vetorTipo[i].id] = vetorTipo[i];
	// 			}

	// 		});
	// 	}else if(res.statusCode != 747){
	// 		document.getElementById('msgErroModal').innerHTML = "Não foi possível listar tipos de item";
	// 		$("#erroModal").modal('show');
	// 		return;
	// 	}
		if(!listaItem){
			return;
		}
		for(let i = 0; i < listaItem.length; i++){
			$("#tabelaItem").append("\
			<tr>\
			    <th id='nomeItemLista"+ i +"'></th>\
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
					  </div>\
					</div>\
			    </td>\
			  </tr>\
			");

			document.getElementById('nomeItemLista' + i).innerHTML = listaItem[i].local + " - " + listaItem[i].nome;
			document.getElementById('nomeItemDados' + i).innerHTML = listaItem[i].nome;
			document.getElementById('localItemDados' + i).innerHTML = listaItem[i].local;
			if(listaItem[i].sigla)
				document.getElementById('siglaItemDados' + i).innerHTML = listaItem[i].sigla;
			else
				document.getElementById('siglaItemDados' + i).innerHTML = "-";

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
	//});	
}

function preencheModalAlterar(item){
	document.getElementById('nomeItemAlterar').value = item.nome;
	document.getElementById('localItemAlterar').value = item.local;
	document.getElementById('siglaItemAlterar').value = item.sigla;
	document.getElementById('idItemAlterar').value = item.id;
}

function preencheModalExcluir(item){
	document.getElementById('nomeItemExcluir').innerHTML = item.local + " - " + item.nome;
	document.getElementById('idItemExcluir').value = item.id;
}

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
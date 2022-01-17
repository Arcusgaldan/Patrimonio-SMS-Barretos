//document.getElementById('btnBuscar').addEventListener('click', buscar, false);
// document.getElementById('btnLimparBusca').addEventListener('click', function(){
// 	document.getElementById('formBuscarItem').reset();
// }, false);
// document.getElementById('btnAcaoItem').addEventListener('click', lote, false);

document.getElementById('localItemCadastrar').addEventListener('change', function(){
	preencheSetor(document.getElementById('localItemCadastrar').value, "setorItemCadastrar");
}, false);
document.getElementById('localItemTransferir').addEventListener('change', function(){
	preencheSetor(document.getElementById('localItemTransferir').value, "setorItemTransferir");
}, false);
document.getElementById('localLoteTransferir').addEventListener('change', function(){
	preencheSetor(document.getElementById('localLoteTransferir').value, "setorLoteTransferir");
}, false);
document.getElementById('localItemInfo').addEventListener('change', function(){
	preencheSetor(document.getElementById('localItemInfo').value, "setorItemInfo");
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

const numSP = "000000"
const strSP = "S/P"
const strSemSetor = "Sem setor"

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
	
	listaItem.forEach(function(obj){
		if(obj['patrimonio'] == numSP){
			obj['patrimonio'] = strSP
		}
		if(obj['setorNome'] == null){
			obj['setorNome'] = strSemSetor
		}
		if(obj['dataMovimentacao']){
			obj['dataMovimentacao'] = utils.formataDataHora(obj['dataMovimentacao'])
		}
	});
	$("#tabelaItem").empty();
	
	model = require('./../../model/mItem')
	var table = $("#tabelaItem").DataTable({
		language: utils.linguagemTabela, 
		data: listaItem,
		columns: model.colunas,
		scrollX: true,
		columnDefs: model.defColunas(),
		order: [[10, 'desc']],
		createdRow: function(row, data, dataIndex){
			if(data.ativo == '0')
				$(row).css('background-color', '#f07f7f');
		}
	});
	$('#tabelaItem tbody').on( 'click', '.btnEditar', function () {
        let data = table.row( $(this).parents('tr') ).data();
		preencheModalAlterar(data)        
    } );
	
	$('#tabelaItem tbody').on( 'click', '.btnExcluir', function () {
        let data = table.row( $(this).parents('tr') ).data();
		preencheModalExcluir(data)
    } );

	$('#tabelaItem tbody').on( 'click', '.btnInfo', function () {
		let data = table.row( $(this).parents('tr') ).data();
		preencheModalInfo(data)
	} );

	$('#tabelaItem tbody').on( 'click', '.btnTransferir', function () {
		let data = table.row( $(this).parents('tr') ).data();
		preencheModalTransferencia(data)
	} );
}

function preencheModalAlterar(item){
	if(item.patrimonio == "S/P"){
		document.getElementById('patrimonioItemAlterar').disabled = true
		document.getElementById('patrimonioItemAlterar').value = ""
		document.getElementById('semPatrimonioItemAlterar').checked = true
	}else{
		document.getElementById('patrimonioItemAlterar').disabled = false
		document.getElementById('patrimonioItemAlterar').value = item.patrimonio
		document.getElementById('semPatrimonioItemAlterar').checked = false
	}
	document.getElementById('marcaItemAlterar').value = item.marca;
	document.getElementById('modeloItemAlterar').value = item.modelo;
	document.getElementById('descricaoItemAlterar').value = item.descricao;
	document.getElementById('tipoItemAlterar').value = item.codTipoItem;
	document.getElementById('idItemAlterar').value = item.id;
}

function preencheModalInfo(item){
	if(item.patrimonio == "S/P"){
		document.getElementById('patrimonioItemInfo').value = ""
		document.getElementById('semPatrimonioItemInfo').checked = true
	}else{
		document.getElementById('patrimonioItemInfo').value = item.patrimonio
		document.getElementById('semPatrimonioItemInfo').checked = false
	}
	document.getElementById('marcaItemInfo').value = item.marca;
	document.getElementById('modeloItemInfo').value = item.modelo;
	document.getElementById('descricaoItemInfo').value = item.descricao;
	document.getElementById('tipoItemInfo').value = item.codTipoItem;
	document.getElementById('idItemInfo').value = item.id;
	document.getElementById('localItemInfo').value = item.localId;
	preencheSetor(item.localId, "setorItemInfo", function(){
		if(item.setorId)
			document.getElementById('setorItemInfo').value = item.setorId;
		else
			document.getElementById('setorItemInfo').value = '0';			
	});
	document.getElementById('setorItemInfo').disabled = true	
	$('#btnHistorico').off('click');
	$('#btnHistorico').on('click', null, function(){preencheModalHistorico(item)});
}

function preencheModalExcluir(item){
	if(item.ativo == 0){
		document.getElementById('tipoAcaoItemExcluir').innerHTML = "reativar";
		document.getElementById('btnInativar').innerHTML = "Reativar"
	}else{
		document.getElementById('tipoAcaoItemExcluir').innerHTML = "inativar";
		document.getElementById('btnInativar').innerHTML = "Inativar"
	}
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
	require('./../../utilsCliente.js').enviaRequisicao('LogTransferencia', 'BUSCAR', {token: localStorage.token, msg: {aliasTabela: "lt", selectCampos: ["s.nome nomeSetor", "l.nome nomeLocal", "lt.data dataTransferencia"], joins: [{tabela: "TBSetor s", on: "s.id = lt.codSetor", tipo: "LEFT"}, {tabela: "TBLocal l", on: "l.id = lt.codLocal"}], where: "codItem = " + item.id, orderBy: [{campo: "data", sentido: "DESC"}]}}, function(res){
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
				$("#tipoItemInfo > option").remove();

				$("#tipoItemCadastrar").append("<option value='0'>Tipo</option");
				$("#tipoItemAlterar").append("<option value='0'>Tipo</option");
				$("#selectTipoAlterar").append("<option value='0'>Selecione o tipo a ser alterado/excluído</option");
				$("#tipoItemInfo").append("<option value='0'>Tipo</option");


				for(let i = 0; i < vetorTipo.length; i++){
					$("#tipoItemCadastrar").append("<option value='"+vetorTipo[i].id+"'>"+vetorTipo[i].nome+"</option");
					$("#tipoItemAlterar").append("<option value='"+vetorTipo[i].id+"'>"+vetorTipo[i].nome+"</option");
					$("#selectTipoAlterar").append("<option value='"+vetorTipo[i].id+"'>"+vetorTipo[i].nome+"</option");
					$("#tipoItemInfo").append("<option value='"+vetorTipo[i].id+"'>"+vetorTipo[i].nome+"</option");
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
				$("#localItemInfo > option").remove();
				$("#localItemTransferir > option").remove();
				$("#localLoteTransferir > option").remove();
				
				$("#localItemCadastrar").append("<option value='0'>Local</option");
				$("#localItemInfo").append("<option value='0'>Local</option");


				for(let i = 0; i < vetorLocal.length; i++){
					$("#localItemCadastrar").append("<option value='"+vetorLocal[i].id+"'>" + vetorLocal[i].nome + "</option");
					$("#localItemInfo").append("<option value='"+vetorLocal[i].id+"'>" + vetorLocal[i].nome + "</option");
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
			//console.log("Em listaItem::ITEM LISTAR, meu vetorItem[0].dataMovimentacao = " + vetorItem[0].dataMovimentacao)
			preencheTabela(vetorItem);
			preencheCopiarItem(vetorItem);
		});
	}else if(res.statusCode != 747){
		document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível listar itens";
		$("#erroModal").modal('show');
		return;
	}
});
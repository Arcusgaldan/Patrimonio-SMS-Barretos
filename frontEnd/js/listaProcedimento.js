var utils = require('./../../utilsCliente.js');

function buscaComputador(cb){
	var patrimonio = window.location.pathname.split("/")[2];
	// console.log("Em listaBackup::buscaComputador, patrimonio = " + patrimonio);

	var argumentos = {};

	argumentos.selectCampos = ['c.id idComputador'];
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
				var computador = JSON.parse(require('./../../utilsCliente.js').descriptoAES(localStorage.chave, msg))[0];
				// console.log("Em buscaComputador, computador = " + JSON.stringify(computador));
				cb(computador.idComputador);
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
	listaProcedimento.forEach(function(obj){
		if(obj['data']){
			obj['data'] = utils.formataData(obj['data'])
		}
	});
	$("#tabelaProcedimento").empty();
	model = require('./../../model/mProcedimento')
	var table = $("#tabelaProcedimento").DataTable({
		language: utils.linguagemTabela, 
		data: listaProcedimento,
		columns: model.colunas,
		scrollX: true,
		columnDefs: model.defColunas()
	});
	$('#tabelaProcedimento tbody').on( 'click', '.btnEditar', function () {
        let data = table.row( $(this).parents('tr') ).data();
		preencheModalAlterar(data)        
    } );
	
	$('#tabelaProcedimento tbody').on( 'click', '.btnExcluir', function () {
        let data = table.row( $(this).parents('tr') ).data();
		preencheModalExcluir(data)
    } );

	$('#tabelaProcedimento tbody').on( 'click', '.btnInfo', function () {
		let data = table.row( $(this).parents('tr') ).data();
		preencheModalInfo(data)
	} );
}

function preencheModalAlterar(procedimento){
	document.getElementById('idProcedimentoAlterar').value = procedimento.id;
	document.getElementById('computadorProcedimentoAlterar').value = procedimento.codComputador;
	document.getElementById('pecaProcedimentoAlterar').value = procedimento.peca;
	document.getElementById('descricaoProcedimentoAlterar').value = procedimento.descricao;
	document.getElementById('dataProcedimentoAlterar').value = utils.formataDataSimplesDataISO(procedimento.data);
	document.getElementById('setorOrigemProcedimentoAlterar').value = procedimento.setorOrigem
}

function preencheModalInfo(procedimento){
	//document.getElementById('idProcedimentoInfo').value = procedimento.id;
	//document.getElementById('computadorProcedimentoInfo').value = procedimento.codComputador;
	document.getElementById('pecaProcedimentoInfo').value = procedimento.peca;
	document.getElementById('descricaoProcedimentoInfo').value = procedimento.descricao;
	document.getElementById('dataProcedimentoInfo').value = utils.formataDataSimplesDataISO(procedimento.data);
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
				var vetorProcedimento = JSON.parse(require('./../../utilsCliente.js').descriptoAES(localStorage.chave, msg));
				preencheTabela(vetorProcedimento);
			});
		}else if(res.statusCode != 747){
			document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + " Não foi possível listar procedimentos";
			$("#erroModal").modal('show');
			return;
		}
	});
});
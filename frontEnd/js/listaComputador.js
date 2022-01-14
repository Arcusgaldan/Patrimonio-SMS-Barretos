document.getElementById('localItemTransferir').addEventListener('change', function(){
	preencheSetor(document.getElementById('localItemTransferir').value, "setorItemTransferir");
}, false);

function preencheCopiarComputador(listaComputador){
	$("#copiarComputadorCadastrar > option").remove();
	$("#copiarComputadorCadastrar").append("<option value='0'>Selecione um computador com as mesmas características (opcional)</option>");
	
	for(let i = 0; i < listaComputador.length; i++){
		$("#copiarComputadorCadastrar").append("<option value='"+listaComputador[i].id+"'>"+listaComputador[i].itemPatrimonio+"</option>");
	}
}

function preencheSetor(local, select, cb){
	if(local == '0'){
		document.getElementById(select).value = 0;		
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
				$("#localItemTransferir > option").remove();
				$("#localComputadorInfo > option").remove();

				for(let i = 0; i < vetorLocal.length; i++){					
					$("#localItemTransferir").append("<option value='"+vetorLocal[i].id+"'>" + vetorLocal[i].nome + "</option");					
					$("#localComputadorInfo").append("<option value='"+vetorLocal[i].id+"'>" + vetorLocal[i].nome + "</option");					
				}
			});
		}else if(res.statusCode != 747){
			document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível listar locais";
			$("#erroModal").modal('show');
			return;
		}
	});
}

function preencheTabela(listaComputador){	
	if(!listaComputador){
		return;
	}
	$("#tabelaComputador").empty();
	model = require('./../../model/mComputador')
	var table = $("#tabelaComputador").DataTable({
		language: utils.linguagemTabela, 
		data: listaComputador,
		columns: model.colunas,
		scrollX: true,
		columnDefs: model.defColunas(),
		createdRow: function(row, data, dataIndex){
			if(data.ativo == '0')
				$(row).css('background-color', '#f07f7f');			
		}
	});
	$('#tabelaComputador tbody').on( 'click', '.btnEditar', function () {
        let data = table.row( $(this).parents('tr') ).data();
		preencheModalAlterar(data)        
    } );
	
	$('#tabelaComputador tbody').on( 'click', '.btnExcluir', function () {
        let data = table.row( $(this).parents('tr') ).data();
		preencheModalExcluir(data)
    } );

	$('#tabelaComputador tbody').on( 'click', '.btnInfo', function () {
		let data = table.row( $(this).parents('tr') ).data();
		preencheModalInfo(data)
	} );

	$('#tabelaComputador tbody').on( 'click', '.btnTransferir', function () {
		let data = table.row( $(this).parents('tr') ).data();
		preencheModalTransferencia(data)
	} );
}

function preencheModalAlterar(computador){
	document.getElementById('patrimonioComputadorAlterar').value = computador.codItem;
	document.getElementById('patrimonioComputadorAlterar').innerHTML = "<option value='"+computador.codItem+"'>"+computador.itemPatrimonio+"</option>";
	document.getElementById('patrimonioComputadorAlterar').disabled = true;
	
	if(computador.codProcessador == null){		
		document.getElementById('processadorComputadorAlterar').value = '0';
	}else{		
		document.getElementById('processadorComputadorAlterar').value = computador.codProcessador;
	}

	document.getElementById('qtdMemoriaComputadorAlterar').value = computador.qtdMemoria;

	if(computador.tipoMemoria == null){
		document.getElementById('tipoMemoriaComputadorAlterar').value = '0';
	}else{
		document.getElementById('tipoMemoriaComputadorAlterar').value = computador.tipoMemoria;
	}
	
	document.getElementById('armazenamentoComputadorAlterar').value = computador.armazenamento;
	
	for (var key in computador){
		console.log(key + " = " + computador[key])
	}

	if(computador.codSO == null){
		//console.log("Meu SO veio nulo! " + computador.codSo)
		document.getElementById('sistemaComputadorAlterar').value = '0';
	}else{
		//console.log("Meu SO não veio nulo! Coloquei o value = " + computador.codSO)
		document.getElementById('sistemaComputadorAlterar').value = computador.codSO;
	}
	

	if(computador.reserva == 1){
		document.getElementById('reservaComputadorAlterar').checked = true;
	}

	if(computador.aposentado == 1){
		document.getElementById('aposentadoComputadorAlterar').checked = true;
	}

	document.getElementById('idComputadorAlterar').value = computador.id;
}

function preencheModalInfo(computador){
	document.getElementById('patrimonioComputadorInfo').value = computador.codItem;
	document.getElementById('patrimonioComputadorInfo').innerHTML = "<option value='"+computador.codItem+"'>"+computador.itemPatrimonio+"</option>";
	document.getElementById('patrimonioComputadorInfo').disabled = true;
	
	if(computador.codProcessador == null){		
		document.getElementById('processadorComputadorInfo').value = '0';
	}else{		
		document.getElementById('processadorComputadorInfo').value = computador.codProcessador;
	}

	document.getElementById('qtdMemoriaComputadorInfo').value = computador.qtdMemoria;

	if(computador.tipoMemoria == null){
		document.getElementById('tipoMemoriaComputadorInfo').value = '0';
	}else{
		document.getElementById('tipoMemoriaComputadorInfo').value = computador.tipoMemoria;
	}
	
	document.getElementById('armazenamentoComputadorInfo').value = computador.armazenamento;

	if(computador.codSO == null){
		document.getElementById('sistemaComputadorInfo').value = '0';
	}else{
		document.getElementById('sistemaComputadorInfo').value = computador.codSO;
	}

	document.getElementById('localComputadorInfo').value = computador.localId
	preencheSetor(computador.localId, "setorComputadorInfo", function(){
		document.getElementById('setorComputadorInfo').value = computador.setorId
		document.getElementById('setorComputadorInfo').disabled = true
	});
	

	if(computador.reserva == 1){
		document.getElementById('reservaComputadorInfo').checked = true;
	}

	if(computador.aposentado == 1){
		document.getElementById('aposentadoComputadorInfo').checked = true;
	}

	$('#btnHistorico').off('click');
	$('#btnHistorico').on('click', null, function(){preencheModalHistorico(computador)});
	$('#btnProcedimentos').on('click', null, function(){location.href = '/procedimento/' + computador.itemPatrimonio});
}

function preencheModalExcluir(computador){
	//console.log("Em listaComputador::preencheModalExcluir, ativo = " + computador.ativo)
	if(computador.ativo == 0){
		document.getElementById('itemAcaoComputadorExcluir').innerHTML = "reativar"
		document.getElementById('btnInativar').innerHTML = "Reativar"
	}else{
		document.getElementById('itemAcaoComputadorExcluir').innerHTML = "inativar"
		document.getElementById('btnInativar').innerHTML = "Inativar"
	}
	document.getElementById('patrimonioComputadorExcluir').innerHTML = computador.itemPatrimonio;
	document.getElementById('idComputadorExcluir').value = computador.id;
}

function preencheModalTransferencia(computador){
	document.getElementById('patrimonioItemTransferir').value = computador.itemPatrimonio;
	document.getElementById('setorItemTransferir').value = computador.setorId;
	document.getElementById('idItemTransferir').value = computador.codItem;
	document.getElementById('localAntigoItemTransferir').value = computador.localNome;
	document.getElementById('setorAntigoItemTransferir').value = computador.setorNome;
	document.getElementById('idSetorAntigoItemTransferir').value = computador.setorId;
	preencheSetor(document.getElementById('localItemTransferir').value, "setorItemTransferir");
}

function preencheModalHistorico(computador){
	document.getElementById('patrimonioHistorico').innerHTML = computador.itemPatrimonio;
	console.log("Em listaComputador::preencheModalHistorico, meu contInc logo antes de enviar a requisição é " + localStorage.contInc)
	require('./../../utilsCliente.js').enviaRequisicao('LogTransferencia', 'BUSCAR', {token: localStorage.token, msg: {aliasTabela: "lt", selectCampos: ["s.nome nomeSetor", "l.nome nomeLocal", "lt.data dataTransferencia"], joins: [{tabela: "TBSetor s", on: "s.id = lt.codSetor", tipo: "LEFT"}, {tabela: "TBLocal l", on: "l.id = lt.codLocal"}], where: "codItem = " + computador.itemId, orderBy: [{campo: "data", sentido: "DESC"}]}}, function(res){
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

function preenchePatrimonio(){
	var argumentos = {};
	argumentos.aliasTabela = "i";
	argumentos.selectCampos = ["i.id", "i.patrimonio"];
	argumentos.where = "i.codTipoItem = 1 AND i.id NOT IN(SELECT codItem from TBComputador)";
	require('./../../utilsCliente.js').enviaRequisicao("Item", "BUSCAR", {token: localStorage.token, msg: argumentos}, function(res){
		if(res.statusCode == 200){
			var msg = "";
			res.on('data', function(chunk){
				msg += chunk;
			});
			res.on('end', function(){
				var vetorItens = JSON.parse(require('./../../utilsCliente.js').descriptoAES(localStorage.chave, msg));
				$("#patrimonioComputadorCadastrar > option").remove();

				$("#patrimonioComputadorCadastrar").append("<option value='0'>Patrimônio</option>");

				for(let i = 0; i < vetorItens.length; i++){
					$("#patrimonioComputadorCadastrar").append("<option value='" + vetorItens[i].id + "'>" + vetorItens[i].patrimonio + "</option>");
				}
			});
		}else if(res.statusCode != 747){
			console.log("O problema foi no patrimonio com código = " + res.statusCode);
			document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível buscar patrimônios";
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
				$("#processadorComputadorAlterar > option").remove();
				$("#selectProcessadorAlterar > option").remove();
				$("#processadorComputadorInfo > option").remove();

				$("#processadorComputadorCadastrar").append("<option value='0'>Processador</option>");
				$("#processadorComputadorAlterar").append("<option value='0'>Processador</option>");
				$("#selectProcessadorAlterar").append("<option value='0'>Selecione um processador para alterar</option>");
				$("#processadorComputadorInfo").append("<option value='0'>Processador</option>");

				for(let i = 0; i < vetorProcessador.length; i++){
					$("#processadorComputadorCadastrar").append("<option value='" + vetorProcessador[i].id + "'>" + vetorProcessador[i].nome + "</option>");
					$("#processadorComputadorAlterar").append("<option value='" + vetorProcessador[i].id + "'>" + vetorProcessador[i].nome + "</option>");
					$("#selectProcessadorAlterar").append("<option value='" + vetorProcessador[i].id + "'>" + vetorProcessador[i].nome + "</option>");
					$("#processadorComputadorInfo").append("<option value='" + vetorProcessador[i].id + "'>" + vetorProcessador[i].nome + "</option>");
				}
			});
		}else if(res.statusCode != 747){
			console.log("O problema foi no processador com código = " + res.statusCode);
			document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível Info processadores";
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
				$("#sistemaComputadorAlterar > option").remove();
				$("#selectSOAlterar > option").remove();
				$("#sistemaComputadorInfo > option").remove();

				$("#sistemaComputadorCadastrar").append("<option value='0'>Sistema Operacional</option>");
				$("#sistemaComputadorAlterar").append("<option value='0'>Sistema Operacional</option>");
				$("#selectSOAlterar").append("<option value='0'>Selecione um SO para alterar</option>");
				$("#sistemaComputadorInfo").append("<option value='0'>Sistema Operacional</option>");				

				for(let i = 0; i < vetorSO.length; i++){
					$("#sistemaComputadorCadastrar").append("<option value='" + vetorSO[i].id + "'>" + vetorSO[i].nome + "</option>");
					$("#sistemaComputadorAlterar").append("<option value='" + vetorSO[i].id + "'>" + vetorSO[i].nome + "</option>");
					$("#selectSOAlterar").append("<option value='" + vetorSO[i].id + "'>" + vetorSO[i].nome + "</option>");
					$("#sistemaComputadorInfo").append("<option value='" + vetorSO[i].id + "'>" + vetorSO[i].nome + "</option>");					
				}
			});
		}else if(res.statusCode != 747){
			console.log("O problema foi no sistema com código = " + res.statusCode);
			document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível Info processadores";
			$("#erroModal").modal('show');
			return;
		}
	});
}

preenchePatrimonio();
preencheProcessador();
preencheSO();
preencheLocal();
var utils = require('./../../utilsCliente.js');
utils.enviaRequisicao("Computador", "LISTAR", {token: localStorage.token}, function(res){
	if(res.statusCode == 200){
		var msg = "";
		res.on('data', function(chunk){
			msg += chunk;
		});
		res.on('end', function(){
			var vetorComputador = JSON.parse(require('./../../utilsCliente.js').descriptoAES(localStorage.chave, msg));
			preencheCopiarComputador(vetorComputador);			
			preencheTabela(vetorComputador);
		});
	}else if(res.statusCode != 747){
		console.log("O problema foi no computador com código = " + res.statusCode);
		document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível listar computadores";
		$("#erroModal").modal('show');
		return;
	}
});
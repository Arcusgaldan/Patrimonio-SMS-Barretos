document.getElementById('btnBuscar').addEventListener('click', buscar, false);
document.getElementById('btnLimparBusca').addEventListener('click', function(){
	document.getElementById('formBuscarComputador').reset();
}, false);

function buscar(){
	var utils = require('./../../utilsCliente.js');
	var where = "";
	if(document.getElementById('patrimonioComputadorBuscar').value != ""){
		let patrimonio = document.getElementById('patrimonioComputadorBuscar').value;
		while(patrimonio.length < 6){
			patrimonio = "0" + patrimonio;
		}
		where = "i.patrimonio = '" + patrimonio + "'";
	}

	if(document.getElementById('processadorComputadorBuscar').value != "0"){
		let codProcessador = document.getElementById('processadorComputadorBuscar').value;
		if(where == ""){
			where = "codProcessador = " + codProcessador;
		}else{
			where += " AND codProcessador = " + codProcessador;
		}
	}

	if(document.getElementById('qtdMemoriaComputadorBuscar').value != ""){
		let qtdMemoria = document.getElementById('qtdMemoriaComputadorBuscar').value;
		let operador = utils.enumOperador(document.getElementById('argumentoQtdMemoriaComputadorBuscar').value);

		if(where == ""){
			where = "qtdMemoria " +  operador + " " + qtdMemoria;
		}else{
			where += " AND qtdMemoria " +  operador + " " + qtdMemoria;
		}
	}

	if(document.getElementById('tipoMemoriaComputadorBuscar').value != "0"){
		let tipoMemoria = document.getElementById('tipoMemoriaComputadorBuscar').value;

		if(where == ""){
			where = "tipoMemoria = '" + tipoMemoria + "'";
		}else{
			where += " AND tipoMemoria = '" + tipoMemoria + "'";
		}
	}

	if(document.getElementById('armazenamentoComputadorBuscar').value != ""){
		let armazenamento = document.getElementById('armazenamentoComputadorBuscar').value;
		let operador = utils.enumOperador(document.getElementById('argumentoArmazenamentoComputadorBuscar').value);

		if(where == ""){
			where = "armazenamento " + operador + " " + armazenamento;
		}else{
			where += " AND armazenamento" + operador + " " + armazenamento;
		}
	}

	if(document.getElementById('sistemaComputadorBuscar').value != '0'){
		let codSO = document.getElementById('sistemaComputadorBuscar').value;

		if(where == ""){
			where = "codSO = " + codSO;
		}else{
			where += " AND codSO = " + codSO;
		}
	}

	if(document.getElementById('reservaComputadorBuscar').value != '0'){
		let reserva = document.getElementById('reservaComputadorBuscar').value;

		if(where != ""){
			where += " AND ";
		}

		if(reserva == '1'){
			where += "reserva = 1";
		}else{
			where += "reserva = 0";
		}
	}

	if(document.getElementById('aposentadoComputadorBuscar').value != '0'){
		let aposentado = document.getElementById('aposentadoComputadorBuscar').value;

		if(where != ""){
			where += " AND ";
		}

		if(aposentado == '1'){
			where += "aposentado = 1";
		}else{
			where += "aposentado = 0";
		}
	}

	if(where == ""){
		utils.enviaRequisicao("Computador", "LISTAR", {token: localStorage.token}, function(res){
			if(res.statusCode == 200){
				var msg = "";
				res.on('data', function(chunk){
					msg += chunk;
				});
				res.on('end', function(){
					let listaComputador = JSON.parse(msg);
					preencheTabela(listaComputador);
				});
			}else if(res.statusCode == 747){
				$("#tabelaComputador").empty();
			}else{
				document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível listar computadores";
				$("#erroModal").modal('show');
				return;
			}
			$("#buscaModal").modal('toggle');
		});
	}else{
		//console.log("O where do buscar ficou assim: " + where);
		var argumentos = {
			selectCampos: ["TBComputador.*", "p.nome processadorNome", "so.nome sistemaNome", "i.patrimonio itemPatrimonio", "s.nome setorNome", "s.local setorLocal"], 
			joins: [
				{tabela: "TBProcessador p", on: "p.id = TBComputador.codProcessador"}, 
				{tabela: "TBSistemaOperacional so", on: "so.id = TBComputador.codSO"}, 
				{tabela: "TBItem i", on: "i.id = TBComputador.codItem"}, 
				{tabela: "TBLogTransferencia lt", on: "lt.codItem = i.id"}, 
				{tabela: "TBSetor s", on: "s.id = lt.codSetor"}], 
			where: "lt.atual = 1 AND " + where, 
			orderBy: {campos: "i.patrimonio"}
		};

		utils.enviaRequisicao("Computador", "BUSCAR", {token: localStorage.token, msg: argumentos}, function(res){
			if(res.statusCode == 200){
				var msg = "";
				res.on('data', function(chunk){
					msg += chunk;
				});
				res.on('end', function(){
					let listaComputador = JSON.parse(msg);
					preencheTabela(listaComputador);
				});
			}else if(res.statusCode == 747){
				$("#tabelaComputador").empty();
			}else{
				document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível listar computadores";
				$("#erroModal").modal('show');
				return;
			}
			$("#buscaModal").modal('toggle');
		});
	}
}

function preencheTabela(listaComputador){	
	if(!listaComputador){
		return;
	}
	$("#tabelaComputador").empty();
	for(let i = 0; i < listaComputador.length; i++){
		$("#tabelaComputador").append("\
		<tr>\
		    <th id='patrimonioComputadorLista"+ i +"'></th>\
		    <td>\
				<button class='btn btn-info' scope='row' data-toggle='collapse' href='#collapseComputadorLista"+ i +"' role='button' aria-expanded='false' aria-controls='collapseExample'> Mostra Dados <span class='fas fa-plus'></span></button>\
				<button id='alterarComputadorLista"+ i +"' class='btn btn-warning' data-toggle='modal' data-target='#alteraModal' >Alterar Computador</button>\
				<button id='excluirComputadorLista"+ i +"' class='btn btn-danger' data-toggle='modal' data-target='#excluirModal'>Excluir Computador</button>\
				<div id='collapseComputadorLista"+ i +"' class='collapse mostraLista' >\
				  <div class='card card-body'>\
				    <p><strong>Patrimônio: </strong><span id='patrimonioComputadorDados"+i+"'></span></p>\
				  	<p><strong>Processador: </strong> <span id='processadorComputadorDados"+i+"'></span></p>\
				    <p><strong>Quantidade de Memória (GB): </strong> <span id='qtdMemoriaComputadorDados"+i+"'></span></p>\
				    <p><strong>Tipo de Memória: </strong> <span id='tipoMemoriaComputadorDados"+i+"'></span></p>\
				    <p><strong>Armazenamento: </strong> <span id='armazenamentoComputadorDados"+i+"'></span></p>\
				    <p><strong>Sistema Operacional: </strong> <span id='sistemaOperacionalComputadorDados"+i+"'></span></p>\
				    <p><strong>Reserva: </strong> <span id='reservaComputadorDados"+i+"'></span></p>\
				    <p><strong>Aposentado: </strong> <span id='aposentadoComputadorDados"+i+"'></span></p>\
				  </div>\
				</div>\
		    </td>\
		  </tr>\
		");

		document.getElementById('patrimonioComputadorLista' + i).innerHTML = listaComputador[i].itemPatrimonio;
		document.getElementById('patrimonioComputadorDados' + i).innerHTML = listaComputador[i].itemPatrimonio;
		if(listaComputador[i].processadorNome)
			document.getElementById('processadorComputadorDados' + i).innerHTML = listaComputador[i].processadorNome;
		else
			document.getElementById('processadorComputadorDados' + i).innerHTML = "-";

		if(listaComputador[i].qtdMemoria)
			document.getElementById('qtdMemoriaComputadorDados' + i).innerHTML = listaComputador[i].qtdMemoria;
		else
			document.getElementById('qtdMemoriaComputadorDados' + i).innerHTML = "-";

		if(listaComputador[i].tipoMemoria)
			document.getElementById('tipoMemoriaComputadorDados' + i).innerHTML = listaComputador[i].tipoMemoria;
		else
			document.getElementById('tipoMemoriaComputadorDados' + i).innerHTML = "-";

		if(listaComputador[i].armazenamento)
			document.getElementById('armazenamentoComputadorDados' + i).innerHTML = listaComputador[i].armazenamento;
		else
			document.getElementById('armazenamentoComputadorDados' + i).innerHTML = "-";

		if(listaComputador[i].sistemaNome)
			document.getElementById('sistemaOperacionalComputadorDados' + i).innerHTML = listaComputador[i].sistemaNome;
		else
			document.getElementById('sistemaOperacionalComputadorDados' + i).innerHTML = "-";
		
		if(listaComputador[i].reserva == 1)
			document.getElementById('reservaComputadorDados' + i).innerHTML = "Sim";
		else
			document.getElementById('reservaComputadorDados' + i).innerHTML = "Não";

		if(listaComputador[i].aposentado == 1)
			document.getElementById('aposentadoComputadorDados' + i).innerHTML = "Sim";
		else
			document.getElementById('aposentadoComputadorDados' + i).innerHTML = "Não";		

		(function(){
			var computador = listaComputador[i];		
			document.getElementById("alterarComputadorLista"+ i).addEventListener("click", function(){
				preencheModalAlterar(computador);
			}, false);
			document.getElementById("excluirComputadorLista"+ i).addEventListener("click", function(){
				preencheModalExcluir(computador);
			}, false);
		}());
	}	
}

function preencheModalAlterar(computador){
	document.getElementById('patrimonioComputadorAlterar').value = computador.codItem;
	document.getElementById('patrimonioComputadorAlterar').innerHTML = "<option value='"+computador.codItem+"'>"+computador.itemPatrimonio+"</option>";
	document.getElementById('patrimonioComputadorAlterar').disabled = true;
	document.getElementById('processadorComputadorAlterar').value = computador.codProcessador;
	document.getElementById('qtdMemoriaComputadorAlterar').value = computador.qtdMemoria;
	document.getElementById('tipoMemoriaComputadorAlterar').value = computador.tipoMemoria;
	document.getElementById('armazenamentoComputadorAlterar').value = computador.armazenamento;
	document.getElementById('sistemaComputadorAlterar').value = computador.codSO;

	if(computador.reserva == 1){
		document.getElementById('reservaComputadorAlterar').checked = true;
	}

	if(computador.aposentado == 1){
		document.getElementById('aposentadoComputadorAlterar').checked = true;
	}

	document.getElementById('idComputadorAlterar').value = computador.id;
}

function preencheModalExcluir(computador){
	document.getElementById('patrimonioComputadorExcluir').innerHTML = computador.itemPatrimonio;
	document.getElementById('idComputadorExcluir').value = computador.id;
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
				var vetorItens = JSON.parse(msg);
				$("#patrimonioComputadorCadastrar > option").remove();
				$("#patrimonioComputadorAlterar > option").remove();

				$("#patrimonioComputadorCadastrar").append("<option value='0'>Patrimônio</option>");
				$("#patrimonioComputadorAlterar").append("<option value='0'>Patrimônio</option>");

				for(let i = 0; i < vetorItens.length; i++){
					$("#patrimonioComputadorCadastrar").append("<option value='" + vetorItens[i].id + "'>" + vetorItens[i].patrimonio + "</option>");
					$("#patrimonioComputadorAlterar").append("<option value='" + vetorItens[i].id + "'>" + vetorItens[i].patrimonio + "</option>");
				}
			});
		}else if(res.statusCode != 747){
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
				var vetorProcessador = JSON.parse(msg);
				$("#processadorComputadorCadastrar > option").remove();
				$("#processadorComputadorAlterar > option").remove();
				$("#selectProcessadorAlterar > option").remove();
				$("#processadorComputadorBuscar > option").remove();

				$("#processadorComputadorCadastrar").append("<option value='0'>Processador</option>");
				$("#processadorComputadorAlterar").append("<option value='0'>Processador</option>");
				$("#selectProcessadorAlterar").append("<option value='0'>Selecione um processador para alterar</option>");
				$("#processadorComputadorBuscar").append("<option value='0'>Processador</option>");

				for(let i = 0; i < vetorProcessador.length; i++){
					$("#processadorComputadorCadastrar").append("<option value='" + vetorProcessador[i].id + "'>" + vetorProcessador[i].nome + "</option>");
					$("#processadorComputadorAlterar").append("<option value='" + vetorProcessador[i].id + "'>" + vetorProcessador[i].nome + "</option>");
					$("#selectProcessadorAlterar").append("<option value='" + vetorProcessador[i].id + "'>" + vetorProcessador[i].nome + "</option>");
					$("#processadorComputadorBuscar").append("<option value='" + vetorProcessador[i].id + "'>" + vetorProcessador[i].nome + "</option>");
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
				var vetorSO = JSON.parse(msg);
				$("#sistemaComputadorCadastrar > option").remove();
				$("#sistemaComputadorAlterar > option").remove();
				$("#selectSOAlterar > option").remove();
				$("#sistemaComputadorBuscar > option").remove();

				$("#sistemaComputadorCadastrar").append("<option value='0'>Sistema Operacional</option>");
				$("#sistemaComputadorAlterar").append("<option value='0'>Sistema Operacional</option>");
				$("#selectSOAlterar").append("<option value='0'>Selecione um SO para alterar</option>");
				$("#sistemaComputadorBuscar").append("<option value='0'>Sistema Operacional</option>");				

				for(let i = 0; i < vetorSO.length; i++){
					$("#sistemaComputadorCadastrar").append("<option value='" + vetorSO[i].id + "'>" + vetorSO[i].nome + "</option>");
					$("#sistemaComputadorAlterar").append("<option value='" + vetorSO[i].id + "'>" + vetorSO[i].nome + "</option>");
					$("#selectSOAlterar").append("<option value='" + vetorSO[i].id + "'>" + vetorSO[i].nome + "</option>");
					$("#sistemaComputadorBuscar").append("<option value='" + vetorSO[i].id + "'>" + vetorSO[i].nome + "</option>");					
				}
			});
		}else if(res.statusCode != 747){
			document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível buscar processadores";
			$("#erroModal").modal('show');
			return;
		}
	});
}

preenchePatrimonio();
preencheProcessador();
preencheSO();
var utils = require('./../../utilsCliente.js');
utils.enviaRequisicao("Computador", "LISTAR", {token: localStorage.token}, function(res){
	if(res.statusCode == 200){
		var msg = "";
		res.on('data', function(chunk){
			msg += chunk;
		});
		res.on('end', function(){
			var vetorComputador = JSON.parse(msg);
			(function(){
				document.getElementById('btnResetLista').addEventListener('click', function(){preencheTabela(vetorComputador)}, false);
			}());
			preencheTabela(vetorComputador);
		});
	}else if(res.statusCode != 747){
		document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível listar computadores";
		$("#erroModal").modal('show');
		return;
	}
});
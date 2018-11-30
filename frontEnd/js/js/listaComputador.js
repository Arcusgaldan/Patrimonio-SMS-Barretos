function preencheTabela(listaComputador){	
	if(!listaComputador){
		return;
	}
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

		document.getElementById('patrimonioComputadorLista' + i).innerHTML = listaComputador[i].patrimonio;
		document.getElementById('patrimonioComputadorDados' + i).innerHTML = listaComputador[i].patrimonio;
		if(listaComputador[i].processadorNome)
			document.getElementById('processadorComputadorDados' + i).innerHTML = listaComputador[i].processador;
		else
			document.getElementById('processadorComputadorDados' + i).innerHTML = "-";

		if(listaComputador[i].qtdMemoria)
			document.getElementById('qtdMemoriaComputadorDados').innerHTML = listaComputador[i].qtdMemoria;
		else
			document.getElementById('qtdMemoriaComputadorDados').innerHTML = "-";

		if(listaComputador[i].tipoMemoria)
			document.getElementById('tipoMemoriaComputadorDados').innerHTML = listaComputador[i].tipoMemoria;
		else
			document.getElementById('tipoMemoriaComputadorDados').innerHTML = "-";

		if(listaComputador[i].armazenamento)
			document.getElementById('armazenamentoComputadorDados').innerHTML = listaComputador[i].armazenamento;
		else
			document.getElementById('armazenamentoComputadorDados').innerHTML = "-";

		if(listaComputador[i].sistemaNome)
			document.getElementById('sistemaOperacionalComputadorDados' + i).innerHTML = listaComputador[i].sistemaNome;
		else
			document.getElementById('sistemaOperacionalComputadorDados' + i).innerHTML = "-";
		
		if(listaComputador[i].reserva == 1)
			document.getElementById('reservaComputadorDados').innerHTML = "Sim";
		else
			document.getElementById('reservaComputadorDados').innerHTML = "Não";

		if(listaComputador[i].aposentado == 1)
			document.getElementById('aposentadoComputadorDados').innerHTML = "Sim";
		else
			document.getElementById('aposentadoComputadorDados').innerHTML = "Não";		

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
	document.getElementById('patrimonioComputadorAlterar').value = computador.patrimonio;
	document.getElementById('marcaComputadorAlterar').value = computador.marca;
	document.getElementById('modeloComputadorAlterar').value = computador.modelo;
	document.getElementById('descricaoComputadorAlterar').value = computador.descricao;
	document.getElementById('tipoComputadorAlterar').value = computador.codTipoComputador;
	document.getElementById('idComputadorAlterar').value = computador.id;
}

function preencheModalExcluir(computador){
	document.getElementById('patrimonioComputadorExcluir').innerHTML = computador.tipoNome + " - " + computador.patrimonio;
	document.getElementById('idComputadorExcluir').value = computador.id;
}

function preencheTipo(){
	var utils = require('./../../utilsCliente.js');
	utils.enviaRequisicao("TipoComputador", "LISTAR", {token: localStorage.token}, function(res){
		if(res.statusCode == 200){
			var msg = "";
			res.on('data', function(chunk){
				msg += chunk;
			});
			res.on('end', function(){
				var vetorTipo = JSON.parse(msg);
				$("#tipoComputadorCadastrar > option").remove();
				$("#tipoComputadorAlterar > option").remove();
				$("#selectTipoAlterar > option").remove();

				$("#tipoComputadorCadastrar").append("<option value='0'>Tipo</option");
				$("#tipoComputadorAlterar").append("<option value='0'>Tipo</option");
				$("#selectTipoAlterar").append("<option value='0'>Selecione o tipo a ser alterado/excluído</option");
				for(let i = 0; i < vetorTipo.length; i++){
					$("#tipoComputadorCadastrar").append("<option value='"+vetorTipo[i].id+"'>"+vetorTipo[i].nome+"</option");
					$("#tipoComputadorAlterar").append("<option value='"+vetorTipo[i].id+"'>"+vetorTipo[i].nome+"</option");
					$("#selectTipoAlterar").append("<option value='"+vetorTipo[i].id+"'>"+vetorTipo[i].nome+"</option");
				}
			});
		}else if(res.statusCode != 747){
			document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível listar tipos de computador";
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
				$("#setorComputadorCadastrar > option").remove();
				$("#setorComputadorCadastrar").append("<option value='0'>Setor</option");

				for(let i = 0; i < vetorSetor.length; i++){
					$("#setorComputadorCadastrar").append("<option value='"+vetorSetor[i].id+"'>" + vetorSetor[i].local + " - " + vetorSetor[i].nome+"</option");
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
utils.enviaRequisicao("Computador", "LISTAR", {token: localStorage.token}, function(res){
	if(res.statusCode == 200){
		var msg = "";
		res.on('data', function(chunk){
			msg += chunk;
		});
		res.on('end', function(){
			var vetorComputador = JSON.parse(msg);
			preencheTabela(vetorComputador);
		});
	}else if(res.statusCode != 747){
		document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível listar itens";
		$("#erroModal").modal('show');
		return;
	}
});
document.getElementById('btnAlterar').addEventListener('click', alterar, false);

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

function alterar(){
	var procedimento = require('./../../model/mProcedimento.js').novo();
	
	procedimento.id = document.getElementById('idProcedimentoAlterar').value;
	procedimento.codComputador = document.getElementById('computadorProcedimentoAlterar').value;

	procedimento.data = document.getElementById('dataProcedimentoAlterar').value;
	if(procedimento.data == "")
		procedimento.data = null;

	procedimento.peca = document.getElementById('pecaProcedimentoAlterar').value;
	if(procedimento.peca == '0'){
		document.getElementById('msgErroModal').innerHTML = "Por favor, selecione uma peça";
		$("#erroModal").modal('show');
		return;
	}

	procedimento.descricao = document.getElementById('descricaoProcedimentoAlterar').value;
	if(procedimento.descricao.trim() == ""){
		document.getElementById('msgErroModal').innerHTML = "Por favor, insira uma descrição";
		$("#erroModal").modal('show');
		return;
	}

	buscaComputador(function(idComputador){
		if(!idComputador){
			document.getElementById('msgErroModal').innerHTML = "Não foi possível buscar o computador";
			$("#erroModal").modal('show');
			return;
		}
		procedimento.codComputador = idComputador;

		require('./../../utilsCliente.js').enviaRequisicao('Procedimento', 'ALTERAR', {token: localStorage.token, msg: procedimento}, function(res){
			if(res.statusCode == 200){
				$("#sucessoModal").modal('show');
				$('#sucessoModal').on('hide.bs.modal', function(){location.reload();});
		  		setTimeout(function(){location.reload();} , 2000);
			}else if(res.statusCode == 412){
				document.getElementById('msgErroModal').innerHTML = "Por favor, preencha corretamente os dados";
				$("#erroModal").modal('show');
				return;
			}else if(res.statusCode == 415){
				document.getElementById('msgErroModal').innerHTML = "Por favor, insira uma data válida";
				$("#erroModal").modal('show');
				return;
			}else{
				document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Por favor contate o suporte.";
				$("#erroModal").modal('show');
				return;
			}
		});
	});
}
document.getElementById('btnAlterar').addEventListener('click', alterar, false);
document.getElementById('btnAlterarTipo').addEventListener('click', alterarTipo, false);

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

function alterar(){
	var item = require('./../../model/mItem.js').novo();
	item.id = document.getElementById('idItemAlterar').value;
	item.patrimonio = document.getElementById('patrimonioItemAlterar').value;
	console.log("Patrimonio.length = " + item.patrimonio.length);
	while(item.patrimonio.length < 6){
		item.patrimonio = "0" + item.patrimonio;
	}
	item.marca = document.getElementById('marcaItemAlterar').value;
	item.modelo = document.getElementById('modeloItemAlterar').value;
	item.descricao = document.getElementById('descricaoItemAlterar').value;
	item.codTipoItem = document.getElementById('tipoItemAlterar').value;

	if(!require('./../../controller/cItem.js').validar(item) || item.codTipoItem == '0'){
		document.getElementById('msgErroModal').innerHTML = "Por favor, preencha corretamente os dados";
		$("#erroModal").modal('show');
		return;
	}

	require('./../../utilsCliente.js').enviaRequisicao("Item", "ALTERAR", {token: localStorage.token, msg: item}, function(res){
		if(res.statusCode == 200){
			$("#sucessoModal").modal('show');
			$('#sucessoModal').on('hide.bs.modal', function(){location.reload();});
	    	setTimeout(function(){location.reload();} , 2000);
		}else if(res.statusCode == 412){
			document.getElementById('msgErroModal').innerHTML = "Por favor, preencha corretamente os dados";
			$("#erroModal").modal('show');
			return;
		}else{
			document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Por favor contate o suporte.";
			$("#erroModal").modal('show');
			return;
		}
	});
}

function alterarTipo(){
	var tipoItem = require('./../../model/mTipoItem.js').novo();
	tipoItem.id = document.getElementById('selectTipoAlterar').value;
	tipoItem.nome = document.getElementById('nomeTipoAlterar').value;

	if(!require('./../../controller/cTipoItem.js').validar(tipoItem) || tipoItem.id == '0'){
		document.getElementById('msgErroModal').innerHTML = "Por favor, preencha corretamente os dados";
		$("#erroModal").modal('show');
		return;
	}

	require('./../../utilsCliente.js').enviaRequisicao("TipoItem", "ALTERAR", {token: localStorage.token, msg: tipoItem}, function(res){
		if(res.statusCode == 200){
			$("#sucessoModal").modal('show');
			$('#alteraTipoModal').modal('toggle');
			preencheTipo();
		}else if(res.statusCode == 412){
			document.getElementById('msgErroModal').innerHTML = "Por favor, preencha corretamente os dados";
			$("#erroModal").modal('show');
			return;
		}else{
			document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Por favor contate o suporte.";
			$("#erroModal").modal('show');
			return;
		}
	});
}
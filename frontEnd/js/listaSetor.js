function preencheLocal(){
	require('./../../utilsCliente.js').enviaRequisicao('Local', 'LISTAR', {token: localStorage.token}, function(res){
		if(res.statusCode == 200){
			var msg = "";
			res.on('data', function(chunk){
				msg += chunk;
			});
			res.on('end', function(){
				let listaLocal = JSON.parse(require('./../../utilsCliente.js').descriptoAES(localStorage.chave, msg));
				$("#localSetorCadastrar > option").remove();
				$("#localSetorAlterar > option").remove();
				$("#selectLocalAlterar > option").remove();
				$("#localSetorInfo > option").remove();

				$("#localSetorCadastrar").append("<option value='0'>Local</option");
				$("#localSetorAlterar").append("<option value='0'>Local</option");
				$("#selectLocalAlterar").append("<option value='0'>Local</option");

				for(let i = 0; i < listaLocal.length; i++){
					$("#localSetorCadastrar").append("<option value='"+ listaLocal[i].id +"'>" + listaLocal[i].nome + "</option>");
					$("#localSetorAlterar").append("<option value='"+ listaLocal[i].id +"'>" + listaLocal[i].nome + "</option>");
					$("#selectLocalAlterar").append("<option value='"+ listaLocal[i].id +"'>" + listaLocal[i].nome + "</option>");
					$("#localSetorInfo").append("<option value='"+ listaLocal[i].id +"'>" + listaLocal[i].nome + "</option>");	
				}				
				//console.log("Ao final de preencheLocal, o value de selectLocalAlterar é " + document.getElementById('selectLocalAlterar').value)
			});
		}else if(res.statusCode != 747){
			document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível listar local";
			$("#erroModal").modal('show');
			return;
		}
	});
}

function preencheTabela(listaSetor){
	if(!listaSetor){
		return;
	}
	$("#tabelaSetor").empty();
	model = require('./../../model/mSetor')
	var table = $("#tabelaSetor").DataTable({
		language: utils.linguagemTabela, 
		data: listaSetor,
		columns: model.colunas,
		scrollX: true,
		columnDefs: model.defColunas()
	});
	$('#tabelaSetor tbody').on( 'click', '.btnEditar', function () {
        let data = table.row( $(this).parents('tr') ).data();
		preencheModalAlterar(data)        
    } );
	
	$('#tabelaSetor tbody').on( 'click', '.btnExcluir', function () {
        let data = table.row( $(this).parents('tr') ).data();
		preencheModalExcluir(data)
    } );

	$('#tabelaSetor tbody').on( 'click', '.btnInfo', function () {
		let data = table.row( $(this).parents('tr') ).data();
		preencheModalInfo(data)
	} );
}

function preencheModalAlterar(setor){
	document.getElementById('nomeSetorAlterar').value = setor.nome;
	document.getElementById('localSetorAlterar').value = setor.localId;
	document.getElementById('idSetorAlterar').value = setor.id;
}

function preencheModalInfo(setor){
	document.getElementById('nomeSetorInfo').value = setor.nome;
	document.getElementById('localSetorInfo').value = setor.localId;
}

function preencheModalExcluir(setor){
	document.getElementById('nomeSetorExcluir').innerHTML = setor.localNome + " - " + setor.nome;
	document.getElementById('idSetorExcluir').value = setor.id;
}

preencheLocal();

var utils = require('./../../utilsCliente.js');
utils.enviaRequisicao("Setor", "LISTAR", {token: localStorage.token}, function(res){
	if(res.statusCode == 200){
		var msg = "";
		res.on('data', function(chunk){
			msg += chunk;
		});
		res.on('end', function(){
			var vetorSetor = JSON.parse(require('./../../utilsCliente.js').descriptoAES(localStorage.chave, msg));
			preencheTabela(vetorSetor);
		});
	}else if(res.statusCode != 747){
		document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível listar setores";
		$("#erroModal").modal('show');
		return;
	}
});
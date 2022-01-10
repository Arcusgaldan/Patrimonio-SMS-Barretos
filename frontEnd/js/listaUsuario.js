var utils = require('./../../utilsCliente.js');

function preencheTabela(listaUsuario){
	if(!listaUsuario){
		return;
	}
	$("#tabelaUsuario").empty();
	model = require('./../../model/mUsuario')
	var table = $("#tabelaUsuario").DataTable({
		language: utils.linguagemTabela, 
		data: listaUsuario,
		columns: model.colunas,
		scrollX: true,
		columnDefs: model.defColunas(),
		createdRow: function(row, data, dataIndex){
			if(data.ativo == '0')
				$(row).css('background-color', '#f07f7f');			
		}
	});
	$('#tabelaUsuario tbody').on( 'click', '.btnEditar', function () {
        let data = table.row( $(this).parents('tr') ).data();
		preencheModalAlterar(data)        
    } );
	
	$('#tabelaUsuario tbody').on( 'click', '.btnExcluir', function () {
        let data = table.row( $(this).parents('tr') ).data();
		preencheModalExcluir(data)
    } );

	$('#tabelaUsuario tbody').on( 'click', '.btnInfo', function () {
		let data = table.row( $(this).parents('tr') ).data();
		preencheModalInfo(data)
	} );
}

function preencheModalAlterar(usuario){
	document.getElementById('nomeUsuarioAlterar').value = usuario.nome;
	document.getElementById('emailUsuarioAlterar').value = usuario.email;
	
	if(usuario.senhaExpirada == 1){		
		document.getElementById('senhaExpiradaUsuarioAlterar').checked = true;
	}else{
		document.getElementById('senhaExpiradaUsuarioAlterar').checked = false;
	}

	document.getElementById('idUsuarioAlterar').value = usuario.id;
	document.getElementById('senhaAntigaUsuarioAlterar').value = usuario.senha;
}

function preencheModalInfo(usuario){
	document.getElementById('nomeUsuarioInfo').value = usuario.nome;
	document.getElementById('emailUsuarioInfo').value = usuario.email;
	
	if(usuario.senhaExpirada == 1){		
		document.getElementById('senhaExpiradaUsuarioInfo').checked = true;
	}
}

function preencheModalExcluir(usuario){
	if(usuario.ativo == 0){
		document.getElementById('tipoAcaoUsuarioExcluir').innerHTML = "reativar"
		document.getElementById('btnInativar').innerHTML = "Reativar"
	}else{
		document.getElementById('tipoAcaoUsuarioExcluir').innerHTML = "inativar"
		document.getElementById('btnInativar').innerHTML = "Inativar"
	}
	document.getElementById('nomeUsuarioExcluir').innerHTML = usuario.nome;
	document.getElementById('idUsuarioExcluir').value = usuario.id;
}

var utils = require('./../../utilsCliente.js');
utils.enviaRequisicao("Usuario", "LISTAR", {token: localStorage.token}, function(res){
	if(res.statusCode == 200){
		var msg = "";
		res.on('data', function(chunk){
			msg += chunk;
		});
		res.on('end', function(){
			console.log("O que veio pela rede: " + msg);
			var vetorUsuario = JSON.parse(utils.descriptoAES(localStorage.chave, msg));
			console.log("O que foi descriptografado: " + JSON.stringify(vetorUsuario));
			preencheTabela(vetorUsuario);
		});
	}else if(res.statusCode != 747){
		document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível listar usuarios";
		$("#erroModal").modal('show');
		return;
	}
});
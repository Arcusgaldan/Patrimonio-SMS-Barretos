function preencheTabela(listaUsuario){
	if(!listaUsuario){
		return;
	}
	for(let i = 0; i < listaUsuario.length; i++){
		$("#tabelaUsuario").append("\
		<tr>\
		    <th id='nomeUsuarioLista"+ i +"'></th>\
		    <td>\
				<button class='btn btn-info' scope='row' data-toggle='collapse' href='#collapseUsuarioLista"+ i +"' role='button' aria-expanded='false' aria-controls='collapseExample'> Mostra Dados <span class='fas fa-plus'></span></button>\
				<button id='alterarUsuarioLista"+ i +"' class='btn btn-warning' data-toggle='modal' data-target='#alteraModal' >Alterar Usuário</button>\
				<button id='excluirUsuarioLista"+ i +"' class='btn btn-danger' data-toggle='modal' data-target='#excluirModal'>Excluir Usuário</button>\
				<div id='collapseUsuarioLista"+ i +"' class='collapse mostraLista' >\
				  <div class='card card-body'>\
				    <p><strong>Nome: </strong><span id='nomeUsuarioDados"+i+"'></span></p>\
				    <p><strong>CPF: </strong> <span id='cpfUsuarioDados"+i+"'></span></p>\
				    <p><strong>E-Mail: </strong> <span id='emailUsuarioDados"+i+"'></span></p>\
				  </div>\
				</div>\
		    </td>\
		  </tr>\
		");

		document.getElementById('nomeUsuarioLista' + i).innerHTML = listaUsuario[i].nome;
		document.getElementById('nomeUsuarioDados' + i).innerHTML = listaUsuario[i].nome;
		document.getElementById('cpfUsuarioDados' + i).innerHTML = listaUsuario[i].cpf;
		document.getElementById('emailUsuarioDados' + i).innerHTML = listaUsuario[i].email;

		(function(){
			var usuario = listaUsuario[i];		
			document.getElementById("alterarUsuarioLista"+ i).addEventListener("click", function(){
				preencheModalAlterar(usuario);
			}, false);
			document.getElementById("excluirUsuarioLista"+ i).addEventListener("click", function(){
				preencheModalExcluir(usuario);
			}, false);
		}());
	}
}

function preencheModalAlterar(usuario){
	document.getElementById('nomeUsuarioAlterar').value = usuario.nome;
	document.getElementById('cpfUsuarioAlterar').value = usuario.cpf;
	document.getElementById('emailUsuarioAlterar').value = usuario.email;
	if(usuario.senhaExpirada == 1){		
		document.getElementById('senhaExpiradaUsuarioAlterar').checked = true;
	}

	document.getElementById('idUsuarioAlterar').value = usuario.id;
	document.getElementById('senhaAntigaUsuarioAlterar').value = usuario.senha;
}

function preencheModalExcluir(usuario){
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
			var vetor = JSON.parse(msg);
			preencheTabela(vetor);
		});
	}
});
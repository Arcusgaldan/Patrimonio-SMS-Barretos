document.getElementById('btnBuscar').addEventListener('click', buscar, false);
document.getElementById('btnLimparBusca').addEventListener('click', function(){
	document.getElementById('formBuscarUsuario').reset();
}, false);

function validaCpf(cpf){
	cpf = cpf.replace(/[^\d]+/g, '');
	if(cpf == '')
		return false; //True para permitir a ausência de um CPF
	// console.log("Passei pelo 1 return false!");
	if(cpf.length != 11)
		return false;
	// console.log("Passei pelo 2 return false!");


	if(cpf == '111111111' ||
		cpf == '222222222' ||
		cpf == '333333333' ||
		cpf == '444444444' ||
		cpf == '555555555' ||
		cpf == '666666666' ||
		cpf == '777777777' ||
		cpf == '888888888' ||
		cpf == '999999999' ||
		cpf == '000000000')
		return false;
	// console.log("Passei pelo 3 return false!");


	var soma = 0;
	var init = 10;
	for(let i = 0; i < cpf.length - 2; i++){
		soma += parseInt(cpf.charAt(i)) * init;
		init--;
	}
	var resto = (soma * 10) % 11;
	if(resto == 10)
		resto = 0;

	if(resto != cpf.charAt(9)){
		// console.log(resto + " != " + cpf.charAt(9));
		return false;
	}
	// console.log("Passei pelo 4 return false!");

	soma = 0;
	init = 11;

	for(let i = 0; i < cpf.length - 1; i++){
		soma += parseInt(cpf.charAt(i) * init);
		init--;
	}
	resto = (soma * 10) % 11;
	if(resto == 10)
		resto = 0;

	if(resto != cpf.charAt(10)){
		return false;
	}
	// console.log("Passei pelo 5 return false!");	

	return true;
}

document.getElementById('cpfUsuarioCadastrar').addEventListener('focusout', function(){
	if(document.getElementById('cpfUsuarioCadastrar').value == ''){
		document.getElementById('cpfUsuarioCadastrar').classList.remove('border', 'border-danger');
		return;
	}
	if(document.getElementById('cpfUsuarioCadastrar').value.match(/\d{11}/g)){
		let antigoCpf = document.getElementById('cpfUsuarioCadastrar').value;
		let vetorCpf = [antigoCpf.slice(0, 3), antigoCpf.slice(3, 6), antigoCpf.slice(6, 9), antigoCpf.slice(9, 11)];
		document.getElementById('cpfUsuarioCadastrar').value = vetorCpf[0] + "." + vetorCpf[1] + "." + vetorCpf[2] + "-" + vetorCpf[3];
		if(validaCpf(antigoCpf))
			document.getElementById('cpfUsuarioCadastrar').classList.remove('border', 'border-danger');
		else{
			document.getElementById('cpfUsuarioCadastrar').classList.add('border', 'border-danger');
			document.getElementById('cpfUsuarioCadastrar').focus();	
		}
	}else if(!document.getElementById('cpfUsuarioCadastrar').value.match(/\d{3}.\d{3}.\d{3}-\d{2}/g)){
		document.getElementById('cpfUsuarioCadastrar').classList.add('border', 'border-danger');
		document.getElementById('cpfUsuarioCadastrar').focus();
	}else{
		if(validaCpf(document.getElementById('cpfUsuarioCadastrar').value))
			document.getElementById('cpfUsuarioCadastrar').classList.remove('border', 'border-danger');
		else{
			document.getElementById('cpfUsuarioCadastrar').classList.add('border', 'border-danger');
			document.getElementById('cpfUsuarioCadastrar').focus();
		}
	}
}, false);

document.getElementById('cpfUsuarioAlterar').addEventListener('focusout', function(){
	if(document.getElementById('cpfUsuarioAlterar').value == ''){
		document.getElementById('cpfUsuarioAlterar').classList.remove('border', 'border-danger');
		return;
	}
	if(document.getElementById('cpfUsuarioAlterar').value.match(/\d{11}/g)){
		let antigoCpf = document.getElementById('cpfUsuarioAlterar').value;
		let vetorCpf = [antigoCpf.slice(0, 3), antigoCpf.slice(3, 6), antigoCpf.slice(6, 9), antigoCpf.slice(9, 11)];
		document.getElementById('cpfUsuarioAlterar').value = vetorCpf[0] + "." + vetorCpf[1] + "." + vetorCpf[2] + "-" + vetorCpf[3];
		if(validaCpf(antigoCpf))
			document.getElementById('cpfUsuarioAlterar').classList.remove('border', 'border-danger');
		else{
			document.getElementById('cpfUsuarioAlterar').classList.add('border', 'border-danger');
			document.getElementById('cpfUsuarioAlterar').focus();	
		}
	}else if(!document.getElementById('cpfUsuarioAlterar').value.match(/\d{3}.\d{3}.\d{3}-\d{2}/g)){
		document.getElementById('cpfUsuarioAlterar').classList.add('border', 'border-danger');
		document.getElementById('cpfUsuarioAlterar').focus();
	}else{
		if(validaCpf(document.getElementById('cpfUsuarioAlterar').value))
			document.getElementById('cpfUsuarioAlterar').classList.remove('border', 'border-danger');
		else{
			document.getElementById('cpfUsuarioAlterar').classList.add('border', 'border-danger');
			document.getElementById('cpfUsuarioAlterar').focus();
		}
	}
}, false);

document.getElementById('cpfUsuarioBuscar').addEventListener('focusout', function(){
	if(document.getElementById('cpfUsuarioBuscar').value == "")
		return;
	if(document.getElementById('cpfUsuarioBuscar').value.match(/\d{11}/g)){
		let antigoCpf = document.getElementById('cpfUsuarioBuscar').value;
		let vetorCpf = [antigoCpf.slice(0, 3), antigoCpf.slice(3, 6), antigoCpf.slice(6, 9), antigoCpf.slice(9, 11)];
		document.getElementById('cpfUsuarioBuscar').value = vetorCpf[0] + "." + vetorCpf[1] + "." + vetorCpf[2] + "-" + vetorCpf[3];
		if(validaCpf(antigoCpf))
			document.getElementById('cpfUsuarioBuscar').classList.remove('border', 'border-danger');
		else{
			document.getElementById('cpfUsuarioBuscar').classList.add('border', 'border-danger');	
			document.getElementById('cpfUsuarioBuscar').focus();
		}
	}else if(!document.getElementById('cpfUsuarioBuscar').value.match(/\d{3}.\d{3}.\d{3}-\d{2}/g)){
		document.getElementById('cpfUsuarioBuscar').classList.add('border', 'border-danger');
		document.getElementById('cpfUsuarioBuscar').focus();
	}else{
		if(validaCpf(document.getElementById('cpfUsuarioBuscar').value))
			document.getElementById('cpfUsuarioBuscar').classList.remove('border', 'border-danger');
		else{
			document.getElementById('cpfUsuarioBuscar').classList.add('border', 'border-danger');
			document.getElementById('cpfUsuarioBuscar').focus();
		}
	}
}, false);

function buscar(){
	var utils = require('./../../utilsCliente.js');
	var where = "";

	if(document.getElementById('nomeUsuarioBuscar').value != ''){
		let nome = document.getElementById('nomeUsuarioBuscar').value;

		if(where != ""){
			where += " AND "
		}

		where += "nome LIKE '%" + nome + "%'";
	}

	if(document.getElementById('cpfUsuarioBuscar').value != ''){
		let cpf = document.getElementById('cpfUsuarioBuscar').value;

		if(where != ""){
			where += " AND ";
		}

		where += "cpf = '" + cpf + "'";
	}

	if(document.getElementById('emailUsuarioBuscar').value != ''){
		let email = document.getElementById('emailUsuarioBuscar').value;

		if(where != ""){
			where += " AND ";
		}

		where += "email LIKE '%" + email + "%'";
	}

	if(where == ""){
		utils.enviaRequisicao('Usuario', 'LISTAR', {token: localStorage.token}, function(res){
			if(res.statusCode == 200){
				var msg = "";
				res.on('data', function(chunk){
					msg += chunk;
				});
				res.on('end', function(){
					var listaUsuario = JSON.parse(utils.descriptoAES(localStorage.chave, msg));
					preencheTabela(listaUsuario);
				});
			}else if(res.statusCode == 747){
				$("#tabelaUsuario").empty();
			}else{
				document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível listar usuarios";
				$("#erroModal").modal('show');
				return;
			}
			$("#buscaModal").modal('toggle');
		});
	}else{
		utils.enviaRequisicao('Usuario', 'BUSCAR', {token: localStorage.token, msg: {where: where}}, function(res){
			if(res.statusCode == 200){
				var msg = "";
				res.on('data', function(chunk){
					msg += chunk;
				});
				res.on('end', function(){
					var listaUsuario = JSON.parse(utils.descriptoAES(localStorage.chave, msg));
					preencheTabela(listaUsuario);
				});
			}else if(res.statusCode == 747){
				$("#tabelaUsuario").empty();
			}else{
				document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível listar usuarios";
				$("#erroModal").modal('show');
				return;
			}
			$("#buscaModal").modal('toggle');
		});
	}
}

function preencheTabela(listaUsuario){
	if(!listaUsuario){
		return;
	}
	$("#tabelaUsuario").empty();
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
			console.log("O que veio pela rede: " + msg);
			var vetorUsuario = JSON.parse(utils.descriptoAES(localStorage.chave, msg));
			console.log("O que foi descriptografado: " + JSON.stringify(vetorUsuario));
			(function(){
				document.getElementById('btnResetLista').addEventListener('click', function(){preencheTabela(vetorUsuario)}, false);
			}());
			preencheTabela(vetorUsuario);
		});
	}else if(res.statusCode != 747){
		document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Não foi possível listar usuarios";
		$("#erroModal").modal('show');
		return;
	}
});
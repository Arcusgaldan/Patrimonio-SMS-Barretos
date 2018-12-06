document.getElementById('btnCadastrar').addEventListener('click', cadastrarItem, false);
document.getElementById('btnCadastrarTipo').addEventListener('click', cadastrarTipo, false);

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

function cadastrarTipo(){
	var tipoItem = require('./../../model/mTipoItem.js').novo();
	tipoItem.nome = document.getElementById('nomeTipoCadastrar').value;

	if(!require('./../../controller/cTipoItem.js').validar(tipoItem)){
		document.getElementById('msgErroModal').innerHTML = "Por favor, preencha corretamente os dados";
		$("#erroModal").modal('show');
		return;
	}

	require('./../../utilsCliente.js').enviaRequisicao("TipoItem", "INSERIR", {token: localStorage.token, msg: tipoItem}, function(res){
		if(res.statusCode == 200){
			$("#sucessoModal").modal('show');
			$('#cadastraTipoModal').modal('toggle');
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

function cadastrarItem(){
	var item = require('./../../model/mItem.js').novo();
	item.patrimonio = document.getElementById('patrimonioItemCadastrar').value;
	while(item.patrimonio.length < 6){
		item.patrimonio = "0" + item.patrimonio;
	}
	var regex = /\d{6}/;
	if(!item.patrimonio.match(regex)){
		document.getElementById('msgErroModal').innerHTML = "Por favor, insira um patrimônio válido";
		$("#erroModal").modal('show');
		return;
	}
	item.marca = document.getElementById('marcaItemCadastrar').value;
	item.modelo = document.getElementById('modeloItemCadastrar').value;
	item.descricao = document.getElementById('descricaoItemCadastrar').value;
	item.codTipoItem = document.getElementById('tipoItemCadastrar').value;

	if(!require('./../../controller/cItem.js').validar(item) || item.codTipoItem == '0'){
		document.getElementById('msgErroModal').innerHTML = "Por favor, preencha corretamente os dados";
		$("#erroModal").modal('show');
		return;
	}

	require('./../../utilsCliente.js').enviaRequisicao("Item", "INSERIR", {token: localStorage.token, msg: item}, function(res){
		if(res.statusCode == 200){
			console.log("Passo 1 - Inserir item feito com sucesso!");
			var logTransferencia = require('./../../model/mLogTransferencia.js').novo();
			logTransferencia.atual = 1;
			require('./../../utilsCliente.js').enviaRequisicao("Data", "DATAHORA", {token: localStorage.token}, function(res){
				if(res.statusCode == 200){
					console.log("Passo 2 - Buscar DataHora feito com sucesso!");
					var msg = "";
					res.on('data', function(chunk){
						msg += chunk;
					});
					res.on('end', function(){
						console.log("DataHora = " + msg);
						logTransferencia.data = msg;
						require('./../../utilsCliente.js').enviaRequisicao("Item", "BUSCAR", {token: localStorage.token, msg: {where: "patrimonio = " + item.patrimonio}}, function(res){
							if(res.statusCode == 200){
								console.log("Passo 3 - Buscar ID do item feito com sucesso!");
								var msg = "";
								res.on('data', function(chunk){
									msg += chunk;
								});
								res.on('end', function(){
									logTransferencia.codItem = JSON.parse(msg)[0].id;
									logTransferencia.codSetor = document.getElementById('setorItemCadastrar').value;
									require('./../../utilsCliente.js').enviaRequisicao("LogTransferencia", "INSERIR", {token: localStorage.token, msg: logTransferencia}, function(res){
										if(res.statusCode == 200){
											console.log("Passo 4 - Inserir logTransferencia feito com sucesso!");
											$("#sucessoModal").modal('show');
											$('#sucessoModal').on('hide.bs.modal', function(){location.reload();});
									  		setTimeout(function(){location.reload();} , 2000);
										}else{
											console.log("Passo 4 - FALHA ao inserir logTransferencia.\nCodigo do Erro: " + res.statusCode + " Objeto = " + JSON.stringify(logTransferencia));
											document.getElementById('msgErroModal').innerHTML = "Falha ao inserir o log de transferência";
											$("#erroModal").modal('show');								
											require('./../../utilsCliente.js').enviaRequisicao("Item", "EXCLUIR", {token: localStorage.token, msg: {id: logTransferencia.codItem}}, function(res){
												if(res.statusCode != 200){
													document.getElementById('msgErroModal').innerHTML = "Falha ao excluir o item sem setor. Contate o suporte";
													$("#erroModal").modal('show');
													return;
												}
											});
											return;
										}
									});
								});
							}else{
								document.getElementById('msgErroModal').innerHTML = "Falha ao buscar ID do item cadastrado. Contate o suporte";
								$("#erroModal").modal('show');								
								return;
							}
						});
					});
				}else{
					document.getElementById('msgErroModal').innerHTML = "Falha ao buscar data do servidor";
					$("#erroModal").modal('show');
					return;
				}
			});			
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
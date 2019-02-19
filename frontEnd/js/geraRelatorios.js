document.getElementById('btnRelatorioPatrimonio').addEventListener('click', geraRelatorioEquipamentoUnidade, false);

function preencheLocal(){
	require('./../../utilsCliente.js').enviaRequisicao("Local", "LISTAR", {token: localStorage.token}, function(res){
		if(res.statusCode == 200){
			let msg = "";
			res.on('data', function(chunk){
				msg += chunk;
			});
			res.on('end', function(){
				let listaLocal = JSON.parse(require('./../../utilsCliente.js').descriptoAES(localStorage.chave, msg));
				$("#localRelatorioPatrimonio > option").remove();
				$("#localRelatorioPatrimonio").append("<option value='0'>Local</option>");
				for(let i = 0; i < listaLocal.length; i++){
					$("#localRelatorioPatrimonio").append("<option value='" + listaLocal[i].id + "'>" + listaLocal[i].nome + "</option>");
				}
			});
		}else if(res.statusCode != 747){
			document.getElementById('msgErroModal').innerHTML = "Por favor, preencha corretamente os dados";
			$("#erroModal").modal('show');
			return;
		}
	});
}
preencheLocal();

function geraRelatorioEquipamentoUnidade(){
	var idLocal = document.getElementById('localRelatorioPatrimonio').value;
	if(idLocal == '0'){
		document.getElementById('msgErroModal').innerHTML = "Por favor, selecione um local!";
		$("#erroModal").modal('show');
		return;
	}

	// select i.patrimonio itemPatrimonio, ti.nome tipoNome, l.nome localNome, s.nome setorNome 
	// FROM TBLogTransferencia lt 
	// JOIN TBItem i ON i.id = lt.codItem 
	// JOIN TBTipoItem ti ON ti.id = i.codTipoItem 
	// JOIN TBLocal l ON l.id = lt.codLocal 
	// LEFT JOIN TBSetor s ON s.id = lt.codSetor 
	// WHERE lt.atual = 1 AND lt.codLocal = [%ID_LOCAL] 
	// ORDER BY setorNome ASC, tipoNome ASC;

	let argumentos = {
		selectCampos: ['i.patrimonio itemPatrimonio', 'ti.nome tipoNome', 'l.nome localNome', 's.nome setorNome'],
		aliasTabela: 'lt',
		joins: [
			{tabela: "TBItem i", on: "i.id = lt.codItem"},
			{tabela: "TBTipoItem ti", on: "ti.id = i.codTipoItem"},
			{tabela: "TBLocal l", on: "l.id = lt.codLocal"},
			{tabela: "TBSetor s", on: "s.id = lt.codSetor", tipo: "LEFT"}
		],
		where: "lt.atual = 1 AND i.ativo = 1 AND lt.codLocal = " + idLocal,
		orderBy: [
			{campo: 'setorNome', sentido: "ASC"},
			{campo: 'tipoNome', sentido: "ASC"}
		]
	};

	require('./../../utilsCliente.js').enviaRequisicao('LogTransferencia', 'BUSCAR', {token: localStorage.token, msg: argumentos}, function(res){
		if(res.statusCode == 200){
			let msg = "";
			res.on('data', function(chunk){
				msg += chunk;
			});
			res.on('end', function(){
				let relatorio = JSON.parse(require('./../../utilsCliente.js').descriptoAES(localStorage.chave, msg));
				if(relatorio.length == 0){
					document.getElementById('msgErroModal').innerHTML = "Não há registro de equipamentos na unidade selecionada.";
					$("#erroModal").modal('show');
					return;
				}
				//Organizar informações e gerar PDF
			});
		}else{
			document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Por favor contate o suporte.";
			$("#erroModal").modal('show');
			return;
		}
	});
}
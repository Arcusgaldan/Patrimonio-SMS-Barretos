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
				let setorAtual = "";
				let nomeLocal = $('#localRelatorioPatrimonio').children("option:selected").text();
				var conteudo = {
					content: [{text: "Levantamento de Equipamentos de Informática\n" + nomeLocal + "\n\n", style: "header", alignment: "center"}], 
					styles: {
						header: {
							fontSize: 18,
							bold: true
						},
						subheader: {
							fontSize: 15,
							bold: true
						}
					}
				};
				var lista = [];
				for(let i = 0; i < relatorio.length; i++){
					if(setorAtual == "" || setorAtual != relatorio[i].setorNome){
						if(relatorio[i].setorNome == null){
							setorAtual = "Sem setor definido";
						}else{
							setorAtual = relatorio[i].setorNome;
						}
						conteudo.content.push({text: relatorio[i].setorNome, style: "subheader"});
						if(lista.length != 0){
							conteudo.content.push({ul: lista});
							conteudo.content.push({text: "\n"});
						}
						lista = [];
					}
					lista.push(relatorio[i].itemPatrimonio + " - " + relatorio[i].tipoNome);
				}
				conteudo.content.push({text: '\n\nCom as assinaturas abaixo, confirmamos que os dados contidos neste documento são verdadeiros.'});
				conteudo.content.push({columns: [{text: '\n\n\n\n________________________________________\nRafael Lima\nCoordenador da Informática', alignment: 'left'}, {text: '\n\n\n\n________________________________________\nRafael Lima\nCoordenador do(a) ' + nomeLocal, alignment: 'right'}]});				
				var pdfMake = require('pdfmake/build/pdfmake.js');
				var pdfFonts = require('pdfmake/build/vfs_fonts.js');
				pdfMake.vfs = pdfFonts.pdfMake.vfs;
				var janela = 
				pdfMake.createPdf(conteudo).open({}, window);
			});
		}else{
			document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Por favor contate o suporte.";
			$("#erroModal").modal('show');
			return;
		}
	});
}
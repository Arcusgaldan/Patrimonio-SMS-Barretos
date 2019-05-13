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

	var contSP = 0;

	// select i.patrimonio itemPatrimonio, ti.nome tipoNome, l.nome localNome, s.nome setorNome 
	// FROM TBLogTransferencia lt 
	// JOIN TBItem i ON i.id = lt.codItem 
	// JOIN TBTipoItem ti ON ti.id = i.codTipoItem 
	// JOIN TBLocal l ON l.id = lt.codLocal 
	// LEFT JOIN TBSetor s ON s.id = lt.codSetor 
	// WHERE lt.atual = 1 AND lt.codLocal = [%ID_LOCAL] 
	// ORDER BY setorNome ASC, tipoNome ASC;

	let argumentos = {
		selectCampos: ['i.id itemId', 'i.patrimonio itemPatrimonio', 'ti.nome tipoNome', 'l.nome localNome', 'l.coordenador localCoordenador', 's.nome setorNome'],
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
			{campo: 'tipoNome', sentido: "ASC"},
			{campo: 'itemPatrimonio', sentido: "ASC"}
		]
	};

	require('./../../utilsCliente.js').enviaRequisicao('LogTransferencia', 'BUSCAR', {token: localStorage.token, msg: argumentos}, function(res){
		if(res.statusCode == 200){
			let msg = "";
			res.on('data', function(chunk){
				msg += chunk;
			});
			res.on('end', function(){
				console.log("A resposta de relatorio recebida foi: " + require('./../../utilsCliente.js').descriptoAES(localStorage.chave, msg));
				let relatorio = JSON.parse(require('./../../utilsCliente.js').descriptoAES(localStorage.chave, msg));
				if(relatorio.length == 0){
					document.getElementById('msgErroModal').innerHTML = "Não há registro de equipamentos na unidade selecionada.";
					$("#erroModal").modal('show');
					return;
				}
				let coordenador = relatorio[0].localCoordenador;
				let setorAtual = "";
				let nomeLocal = $('#localRelatorioPatrimonio').children("option:selected").text();
				var conteudo = {
					footer: function(currentPage){
						return [{text: currentPage.toString(), alignment: "right", margin: [0, 0, 10, 0]}];
					},
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
					if(relatorio[i].itemPatrimonio == '000000'){
						relatorio[i].itemPatrimonio = 'S/P';
						contSP++;
					}
					//console.log("No loop do relatório, estou no item de patrimonio: " + relatorio[i].itemPatrimonio);
					if(setorAtual == ""){
						if(relatorio[i].setorNome == null){
							setorAtual = "Sem setor definido";
						}else{
							setorAtual = relatorio[i].setorNome;
						}
						conteudo.content.push({text: setorAtual, style: "subheader"});						
					}else if(setorAtual != relatorio[i].setorNome && !(setorAtual == "Sem setor definido" && relatorio[i].setorNome == null)){
						if(relatorio[i].setorNome == null){
							setorAtual = "Sem setor definido";
						}else{
							setorAtual = relatorio[i].setorNome;
						}

						conteudo.content.push({ul: lista});
						conteudo.content.push({text: "\n"});
						lista = [];

						conteudo.content.push({text: setorAtual, style: "subheader"});
					}
					
					lista.push(relatorio[i].itemPatrimonio + " - " + relatorio[i].tipoNome);
				}
				
				if(lista.length != 0){
					conteudo.content.push({ul: lista});
					conteudo.content.push({text: "\n"});
				}
				lista = [];
				if(contSP > 0){
					conteudo.content.push({text: '\nExistem ' + contSP + ' itens sem patrimônio nesta unidade.'});	
				}
				require('./../../utilsCliente.js').enviaRequisicao('Data', 'DATAEXTENSO', {token: localStorage.token}, function(res){
					var data = "";
					res.on('data', function(chunk){
						data += chunk;
					});
					res.on('end', function(){
						data = require('./../../utilsCliente.js').descriptoAES(localStorage.chave, data);
						conteudo.content.push({text: '\n\nCom as assinaturas abaixo, confirmamos que os dados contidos neste documento são verdadeiros.\n\nBarretos,\n' + data});
						conteudo.content.push({columns: [{text: '\n\n\n\n________________________________________\nRafael Lima\nCoordenador\nInformática', alignment: 'left'}, {text: '\n\n\n\n________________________________________\n' + relatorio[0].localCoordenador + '\nCoordenador(a)\n' + nomeLocal, alignment: 'right'}]});				
						var pdfMake = require('pdfmake/build/pdfmake.js');
						var pdfFonts = require('pdfmake/build/vfs_fonts.js');
						pdfMake.vfs = pdfFonts.pdfMake.vfs;
						var janela = 
						pdfMake.createPdf(conteudo).open({}, window);
					});
				});				
			});
		}else{
			document.getElementById('msgErroModal').innerHTML = "Erro #" + res.statusCode + ". Por favor contate o suporte.";
			$("#erroModal").modal('show');
			return;
		}
	});
}
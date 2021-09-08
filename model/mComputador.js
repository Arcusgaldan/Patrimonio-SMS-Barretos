module.exports = {
	novo: function(){
		var final = {};
		final.id = 0;
		final.qtdMemoria = 0;
		final.tipoMemoria = '';
		final.armazenamento = 0;
		final.codItem = 0;
		final.reserva = 0;
		final.aposentado = 0;
		final.codProcessador = 0;
		final.codSO = 0;
		return final;
	},

	isString: function(atributo){
		var strings = ['processador', 'tipoMemoria', 'SO'];
		for(let i = 0; i < strings.length; i++){
			if(atributo == strings[i])
				return true;
		}
		return false;
	},

	colunas: [
		{"title": "Id", "data": "id"},
		{"title": "Cod Setor", "data": "setorId"},
		{"title": "Cod Local", "data": "localId"},
		{"title": "Processador", "data": "processadorNome"},
		{"title": "Tipo de Memória", "data": "tipoMemoria"},
		{"title": "Memória (GB)", "data": "qtdMemoria"},
		{"title": "Armazenamento (GB)", "data": "armazenamento"},
		{"title": "Sistema Operacional", "data": "sistemaNome"},
		{"title": "Patrimonio", "data": "itemPatrimonio"},
		{"title": "Local", "data": "localNome"},
		{"title": "Setor", "data": "setorNome"},
		{"title": "Ações", "data": null}
	],

	defColunas: function(){
		let colunasBotoes = require('./model.js').colunasBotoes
		colunasBotoes[0]["defaultContent"] += "\
		<button class='btn btnTransferir btn-success' data-toggle='modal' data-target='#transfereModal'><i class='fas fa-exchange-alt'></i></button>" 
		return colunasBotoes.concat([
		{
			"targets": [0, 1, 2, 3, 4, 5, 6, 7],
			"visible": false,
			"searchable": false
		}
		])
	}
}
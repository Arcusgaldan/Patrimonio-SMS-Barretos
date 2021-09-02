module.exports = {
	novo: function(){
		var final = {};
		final.id = 0;
		final.patrimonio = '';
		final.marca = '';
		final.modelo = '';
		final.descricao = '';
		final.codTipoItem = 0;
		final.nomeTipoItem = '';
		final.ativo = 1;
		return final;
	},

	isString: function(atributo){
		var strings = ['patrimonio', 'marca', 'descricao', 'modelo', 'nomeTipoItem'];
		for(let i = 0; i < strings.length; i++){
			if(atributo == strings[i])
				return true;
		}
		return false;
	},

	colunas: [
		{"title": "Id", "data": "id"},
		{"title": "Marca", "data": "marca"},
		{"title": "Modelo", "data": "modelo"},
		{"title": "Descrição", "data": "descricao"},
		{"title": "Cod Tipo Item", "data": "codTipoItem"},
		{"title": "Ativo", "data": "ativo"},
		{"title": "Patrimonio", "data": "patrimonio"},
		{"title": "Tipo do Item", "data": "tipoNome"},
		{"title": "Ações", "data": null}
	],

	defColunas: function(){
		let colunasBotoes = require('./model.js').colunasBotoes
		colunasBotoes[0]["defaultContent"] += "\
		<button class='btn btnTransferir btn-success' data-toggle='modal' data-target='#transfereModal'><i class='fas fa-exchange-alt'></i></button>" 
		return colunasBotoes.concat([
		{
			"targets": [0, 1, 2, 3, 4, 5],
			"visible": false,
			"searchable": false
		}
		])
	}
}
module.exports = {
	novo: function(){
		var final = {};
		final.id = 0;
		final.peca = '';
		final.descricao = '';
		final.data = '';
		final.codComputador = 0;
		return final;
	},

	isString: function(atributo){
		var strings = ['peca', 'descricao', 'data'];
		for(let i = 0; i < strings.length; i++){
			if(atributo == strings[i])
				return true;
		}
		return false;
	},

	colunas: [
		{"title": "Id", "data": "id"},
		{"title": "Id Computador", "data": "codComputador"},
		{"title": "Descrição", "data": "descricao"},
		{"title": "Peça", "data": "peca"},
		{"title": "Data", "data": "data"},
		{"title": "Ações", "data": null}
	],

	defColunas: function(){
		return require('./model.js').colunasBotoes.concat([
		{
			"targets": [0, 1, 2],
			"visible": false,
			"searchable": false
		}
		])
	}
}
module.exports = {
	novo: function(){
		var final = {};
		final.id = 0;
		final.nome = '';
		final.codLocal = 0;
		return final;
	},

	isString: function(atributo){
		var strings = ['nome'];
		for(let i = 0; i < strings.length; i++){
			if(atributo == strings[i])
				return true;
		}
		return false;
	},

	colunas: [
		{"title": "Id", "data": "id"},
		{"title": "Cod Local", "data": "codLocal"},
		{"title": "Setor", "data": "nome"},
		{"title": "Local", "data": "localNome"},
		{"title": "Ações", "data": null}
	],

	defColunas: function(){
		return require('./model.js').colunasBotoes.concat([
		{
			"targets": [0, 1],
			"visible": false,
			"searchable": false
		}
		])
	}
}
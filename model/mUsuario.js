module.exports = {
	novo: function(){
		var final = {};
		final.id = 0;
		final.nome = '';
		final.cpf = '';
		final.email = '';
		final.senha = '';
		final.senhaExpirada = 0;
		return final;
	},

	isString: function(atributo){
		var strings = ['nome', 'cpf', 'email', 'senha'];
		for(let i = 0; i < strings.length; i++){
			if(atributo == strings[i])
				return true;
		}
		return false;
	},

	colunas: [
		{"title": "Id", "data": "id"},
		{"title": "Nome", "data": "nome"},
		{"title": "CPF", "data": "cpf"},
		{"title": "E-mail", "data": "email"}
	],

	defColunas: [
		{
			"targets": [0],
			"visible": false,
			"searchable": false
		}
	]
}
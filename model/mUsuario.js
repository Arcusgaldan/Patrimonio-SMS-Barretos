module.exports = {
	novo: function(){
		var final = {};
		final.id = 0;
		final.nome = '';
		final.email = '';
		final.senha = '';
		final.senhaExpirada = 0;
		return final;
	},

	isString: function(atributo){
		var strings = ['nome', 'email', 'senha'];
		for(let i = 0; i < strings.length; i++){
			if(atributo == strings[i])
				return true;
		}
		return false;
	},

	colunas: [
		{"title": "Id", "data": "id"},
		{"title": "Senha", "data": "senha"},
		{"title": "SenhaExpirada", "data": "senhaExpirada"},
		{"title": "Nome", "data": "nome"},
		{"title": "E-mail", "data": "email"},
		{"title": "Ações", "data": null}
	],

	defColunas: require('./model.js').colunasBotoes.concat([
		{
			"targets": [0, 1, 2],
			"visible": false,
			"searchable": false
		}
	]),

	tableDataToObj: function(data){
		if(!data){
			return null
		}

		obj = this.novo()
		obj.id = data['id']
		obj.nome = data['nome']
		obj.email = data['email']
		obj.senha = data['senha']
		obj.senhaExpirada = data['senhaExpirada']

		return obj
	}
}
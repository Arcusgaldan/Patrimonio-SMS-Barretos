module.exports = {
	novo: function(){
		var final = {};
		final.id = 0;
		final.nome = '';
		final.cpf = '';
		final.email = '';
		final.senha = '';
		return final;
	},

	isString: function(atributo){
		var strings = ['nome', 'cpf', 'email', 'senha'];
		for(let i = 0; i < strings.length; i++){
			if(atributo == strings[i])
				return true;
		}
		return false;
	}
}
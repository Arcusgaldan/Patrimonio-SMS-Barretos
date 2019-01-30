module.exports = {
	novo: function(){
		var final = {};
		final.id = 0;
		final.nome = '';
		final.endereco = '';
		final.telefone = '';
		return final;
	},

	isString: function(atributo){
		var strings = ['nome', 'endereco', 'telefone'];
		for(let i = 0; i < strings.length; i++){
			if(atributo == strings[i])
				return true;
		}
		return false;
	}
}
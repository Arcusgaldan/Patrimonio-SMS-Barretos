module.exports = {
	novo: function(){
		var final = {};
		final.id = 0;
		final.nome = '';
		final.coordenador = '';
		final.endereco = '';
		final.telefone = '';
		return final;
	},

	isString: function(atributo){
		var strings = ['nome', 'endereco', 'telefone', 'coordenador'];
		for(let i = 0; i < strings.length; i++){
			if(atributo == strings[i])
				return true;
		}
		return false;
	}
}
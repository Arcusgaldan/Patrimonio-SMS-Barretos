module.exports = {
	novo: function(){
		var final = {};
		final.id = 0;
		final.patrimonio = '';
		final.marca = '';
		final.descricao = '';
		final.codTipoItem = 0;
		return final;
	},

	isString: function(atributo){
		var strings = ['patrimonio', 'marca', 'descricao'];
		for(let i = 0; i < strings.length; i++){
			if(atributo == strings[i])
				return true;
		}
		return false;
	}
}
module.exports = {
	novo: function(){
		var final = {};
		final.id = 0;
		final.data = '';
		final.nomePasta = '';
		final.tamanho = 0;
		final.codComputador = 0;
		final.codDisco = 0;
		final.observacao = '';
		return final;
	},

	isString: function(atributo){
		var strings = ['data', 'observacao', 'nomePasta'];
		for(let i = 0; i < strings.length; i++){
			if(atributo == strings[i])
				return true;
		}
		return false;
	}
}
module.exports = {
	novo: function(){
		var final = {};
		final.id = 0;
		final.data = '';
		final.local = '';
		final.nomePasta = '';
		final.tamanho = 0;
		final.codComputador = 0;
		return final;
	},

	isString: function(atributo){
		var strings = ['data', 'local', 'nomePasta'];
		for(let i = 0; i < strings.length; i++){
			if(atributo == strings[i])
				return true;
		}
		return false;
	}
}
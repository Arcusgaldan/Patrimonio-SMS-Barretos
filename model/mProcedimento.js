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
	}
}
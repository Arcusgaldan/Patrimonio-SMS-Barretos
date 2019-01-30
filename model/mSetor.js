module.exports = {
	novo: function(){
		var final = {};
		final.id = 0;
		final.nome = '';
		final.sigla = '';
		final.codLocal = 0;
		return final;
	},

	isString: function(atributo){
		var strings = ['nome', 'sigla'];
		for(let i = 0; i < strings.length; i++){
			if(atributo == strings[i])
				return true;
		}
		return false;
	}
}
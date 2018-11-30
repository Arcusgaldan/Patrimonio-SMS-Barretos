module.exports = {
	novo: function(){
		var final = {};
		final.id = 0;
		final.nome = '';
		return final;
	},

	isString: function(atributo){
		var strings = ['nome'];
		for(let i = 0; i < strings.length; i++){
			if(atributo == strings[i])
				return true;
		}
		return false;
	}
}
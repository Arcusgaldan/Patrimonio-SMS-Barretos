module.exports = {
	novo: function(){
		var final = {};
		final.id = 0;
		final.data = '';
		final.codSetor = 0;
		final.codItem = 0;
		final.atual = 0;
		return final;
	},

	isString: function(atributo){
		var strings = ['data'];
		for(let i = 0; i < strings.length; i++){
			if(atributo == strings[i])
				return true;
		}
		return false;
	}
}
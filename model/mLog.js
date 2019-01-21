module.exports = {
	novo: function(){
		var final = {};
		final.id = 0;
		final.chave = 0;
		final.tabela = '';
		final.operacao = '';
		final.mudanca = '';
		final.data = '';
		final.codUsuario = 0;		
		return final;
	},

	isString: function(atributo){
		var strings = ['tabela', 'operacao', 'mudanca', 'data'];
		for(let i = 0; i < strings.length; i++){
			if(atributo == strings[i])
				return true;
		}
		return false;
	}
}
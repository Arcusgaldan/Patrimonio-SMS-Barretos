module.exports = {
	novo: function(){
		var final = {};
		final.id = 0;
		final.qtdMemoria = 0;
		final.tipoMemoria = '';
		final.armazenamento = 0;
		final.codItem = 0;
		final.reserva = 0;
		final.aposentado = 0;
		final.codProcessador = 0;
		final.codSO = 0;
		return final;
	},

	isString: function(atributo){
		var strings = ['processador', 'tipoMemoria', 'SO'];
		for(let i = 0; i < strings.length; i++){
			if(atributo == strings[i])
				return true;
		}
		return false;
	}
}
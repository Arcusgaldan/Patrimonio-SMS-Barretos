module.exports = {
	trataOperacao: function(usuario, operacao, msg, cb){

	},

	validar: function(backup){
		if(!backup){
			return false;
		}

		var validates = require('./../validates.js');

		if(!validates.req(backup.id) || !validates.data(backup.data) || !validates.req(backup.local) || !validates.req(backup.nomePasta) || 
			!validates.req(backup.codComputador)){
			return false;
		}else{
			return true;
		}
	},

	inserir: function(backup, cb){
		if(!this.validar(backup)){
			cb(400);
			return;
		}

		backup.id = 0;
		var sql = "INSERT INTO TBBackup (";
		var campos = "";
		var valores = "";
		for(var key in backup){
			if(backup[key] == null)
				continue;

			if(campos == ""){
				campos += key;
			}else{
				campos += ", " + key;
			}

			var modelo = require('./../model/mBackup.js');
			var aux = "";

			if(modelo.isString(key)){
				aux = '"' + backup[key] + '"';					
			}
			else
				aux = backup[key];

			if(valores == ""){
				valores += aux;
			}else{
				valores += ", " + aux;
			}
		}
		sql += campos + ") values (" + valores + ");";
		var dao = require('./../dao.js');
		dao.inserir(dao.criaConexao(), sql, function(codRes){
			cb(codRes);
		});
	},

	alterar: function(backup, cb){
		if(!this.validar(backup)){
			cb(400);
			return;
		}

		var sql = "UPDATE TBBackup SET ";
		var campos = "";
		for(var key in backup){
			if(key == 'id')
				continue;

			var modelo = require('./../modelo/mBackup.js');
			var aux = "";

			if(modelo.isString(key)){
				aux = '"' + backup[key] + '"';
				
			}
			else
				aux = backup[key];

			if(campos == ""){
				campos += key + " = " + aux;
			}else{
				campos += ", " + key + " = " + aux;
			}
		}
		sql += campos + " WHERE id = " + backup['id'] + ";";
		var dao = require('./../dao.js');
		dao.inserir(dao.criaConexao(), sql, function(codRes){
			cb(codRes);
		});
	},

	excluir: function(id, cb){
		var sql = "DELETE FROM TBBackup WHERE id = " + id + ";";
		var dao = require('./../dao.js');
		dao.inserir(dao.criaConexao(), sql, function(codRes){
			cb(codRes);
		});
	},

	listar: function(cb){
		var sql = "SELECT * FROM TBBackup;";
		var dao = require('./../dao.js');
		dao.buscar(dao.criaConexao(), sql, function(resultado){
			cb(resultado);
		});
	},

	buscar: function(argumentos, cb){
		var selectCampos = '*';
		var comparacoes = "";

		//Acabar de inventar busca com todos os parâmetros possiveis (join, like, etc.)
		//Para passar os valores para busca, usar algo como [{campo: nome, valor: 'Thales', operador: 'LIKE'}, {campo: idade, valor: 20, operador: >}, {campo: objetivo, valor: 'Ficar pobre', operador: <>}]
		//Usar valores padrão, por exemplo se não especificar selectCampos usar *, se não especificar operador usar '=', etc.
	}
}
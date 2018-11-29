module.exports = {
	inserir: function(alvo, objeto, cb){ //Insere as informações passadas pelo servidor

		objeto.id = 0;
		var sql = "INSERT INTO TB" + alvo + " ("; //Inicializa string de comando SQL
		var campos = "";
		var valores = "";
		for(var key in objeto){
			if(objeto[key] == null)
				continue;

			if(campos == ""){
				campos += key;
			}else{
				campos += ", " + key;
			}
			//Acima concatenou os nomes dos campos

			var modelo = require('./../model/m' + alvo + '.js');
			var aux = "";

			if(modelo.isString(key)){
				aux = '"' + objeto[key] + '"';					
			}
			else
				aux = objeto[key];

			if(valores == ""){
				valores += aux;
			}else{
				valores += ", " + aux;
			}
			//Acima concatenou os valores a serem inseridos, colocando aspas naquilo que for string

		}
		sql += campos + ") values (" + valores + ");"; //Finaliza a string de comando sql
		var dao = require('./../dao.js'); //Puxa o módulo DAO, responsável pela conexão com o BD
		dao.inserir(dao.criaConexao(), sql, function(codRes){ //Executa o comando de inserção (sql com retorno apenas de status)
			cb(codRes); //Executa o callback com o código retornado pelo callback do DAO.
		});
	},

	alterar: function(alvo, objeto, cb){ //Altera as informações passadas por servidor
		
		var sql = "UPDATE TB" + alvo + " SET "; //Inicializa string de comando SQL
		var campos = "";
		for(var key in objeto){
			if(key == 'id') //Pula o campo ID pois o ID nunca será alterado
				continue;

			var modelo = require('./../model/m' + alvo + '.js');
			var aux = "";

			if(modelo.isString(key)){
				aux = '"' + objeto[key] + '"';
				
			}
			else
				aux = objeto[key];

			if(campos == ""){
				campos += key + " = " + aux;
			}else{
				campos += ", " + key + " = " + aux;
			}
			//Acima concatenou os nomes dos campos e seus valores
		}
		sql += campos + " WHERE id = " + objeto['id'] + ";"; //Finaliza a string de comando SQL
		var dao = require('./../dao.js'); //Puxa o módulo DAO, responsável pela conexão com o BD
		dao.inserir(dao.criaConexao(), sql, function(codRes){ //Executa o comando de inserção (SQL com retorno apenas de status)
			cb(codRes); //Executa o callback com o código retornado pelo callback do DAO
		});
	},

	excluir: function(alvo, objeto, cb){ //Exclui o registro cujo ID seja igual o ID fornecido pelo servidor
		var sql = "DELETE FROM TB" + alvo + " WHERE id = " + objeto.id + ";";
		var dao = require('./../dao.js');
		dao.inserir(dao.criaConexao(), sql, function(codRes){
			cb(codRes);
		});
	},

	listar: function(alvo, cb, argumentos){ //Lista todos os registros da tabela;
		var sql;
		if(!argumentos)
			sql = "SELECT * FROM TB" + alvo;
		else{
			if(argumentos.campos && argumentos.joins){
				sql = "SELECT " + argumentos.campos + " FROM TB" + alvo;
				for(let i = 0; i < argumentos.joins.length; i++){
					sql += " JOIN " + argumentos.joins[i].tabela + " ON " + argumentos.joins[i].on;
				}
			}else
				sql = "SELECT * FROM TB" + alvo;

			if(argumentos.orderBy){
				if(argumentos.orderBy.campos){
					sql += " ORDER BY " + argumentos.orderBy.campos;
				}else{
					sql += " ORDER BY id";
				}

				if(argumentos.orderBy.sentido){
					sql += " " + sentido + ";";
				}else{
					sql += " ASC;";
				}
			}
		}
		var dao = require('./../dao.js');
		dao.buscar(dao.criaConexao(), sql, function(resultado){
			cb(resultado);
		});
	},

	buscar: function(alvo, argumentos, cb){ //Busca registros na tabela baseado nos argumentos recebidos pelo servidor
		var sql = "SELECT ";		
		var selectCampos = "";
		var comparacoes = "";
		var joins = "";
		var orderCampos = "id";
		var orderSentido = "ASC";

		if(argumentos.selectCampos){
			for(let i = 0; i < argumentos.selectCampos.length; i++){
				if(i == argumentos.selectCampos.length - 1){
					selectCampos += argumentos.selectCampos[i];
				}else{
					selectCampos += argumentos.selectCampos[i] + ", ";
				}
			}
		}else{
			selectCampos = "*";
		}

		sql += selectCampos + " FROM TB" + alvo + " ";

		if(argumentos.joins){
			for(let i = 0; i < argumentos.joins.length; i++){
				joins += "JOIN " + argumentos.joins[i].tabela + " ON " + argumentos.joins[i].on + " ";
			}
		}

		if(!argumentos.where){
			cb(null);
		}

		if(argumentos.orderBy){
			if(argumentos.orderBy.campos){
				orderCampos = argumentos.orderBy.campos;
			}

			if(argumentos.orderBy.sentido && (sentido == "ASC" || sentido == "DESC")){
				orderSentido = argumentos.orderBy.sentido
			}
		}

		sql += joins + "WHERE " + argumentos.where + " ORDER BY " + orderCampos + " " + orderSentido + ";";

		var dao = require('./../dao.js');
		dao.buscar(dao.criaConexao(), sql, function(resultado){
			cb(resultado);
		});

		//Acabar de inventar busca com todos os parâmetros possiveis (join, like, etc.)
		//Para passar os valores para busca, usar algo como [{campo: nome, valor: 'Thales', operador: 'LIKE'}, {campo: idade, valor: 20, operador: >}, {campo: objetivo, valor: 'Ficar pobre', operador: <>}]
		//Usar valores padrão, por exemplo se não especificar selectCampos usar *, se não especificar operador usar '=', etc.
	}
}
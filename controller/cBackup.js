module.exports = {
	trataOperacao: function(usuario, operacao, msg, cb){ //Encaminha a execução para a operação passada pelo servidor (esta função também é responsável por fazer o controle de acesso às funções restritas apenas a usuários logados)

	},

	validar: function(backup){ //Valida os campos necessários em seu formato ideal
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

	inserir: function(backup, cb){ //Insere as informações passadas pelo servidor
		if(!this.validar(backup)){ //Se os dados não forem válidos, para a execução e retorna código de erro
			cb(400);
			return;
		}

		backup.id = 0;
		var sql = "INSERT INTO TBBackup ("; //Inicializa string de comando SQL
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
			//Acima concatenou os nomes dos campos

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
			//Acima concatenou os valores a serem inseridos, colocando aspas naquilo que for string

		}
		sql += campos + ") values (" + valores + ");"; //Finaliza a string de comando sql
		var dao = require('./../dao.js'); //Puxa o módulo DAO, responsável pela conexão com o BD
		dao.inserir(dao.criaConexao(), sql, function(codRes){ //Executa o comando de inserção (sql com retorno apenas de status)
			cb(codRes); //Executa o callback com o código retornado pelo callback do DAO.
		});
	},

	alterar: function(backup, cb){ //Altera as informações passadas por servidor
		if(!this.validar(backup)){ //Se os dados não forem válidos, para a execução e retorna código de erro
			cb(400);
			return;
		}

		var sql = "UPDATE TBBackup SET "; //Inicializa string de comando SQL
		var campos = "";
		for(var key in backup){
			if(key == 'id') //Pula o campo ID pois o ID nunca será alterado
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
			//Acima concatenou os nomes dos campos e seus valores
		}
		sql += campos + " WHERE id = " + backup['id'] + ";"; //Finaliza a string de comando SQL
		var dao = require('./../dao.js'); //Puxa o módulo DAO, responsável pela conexão com o BD
		dao.inserir(dao.criaConexao(), sql, function(codRes){ //Executa o comando de inserção (SQL com retorno apenas de status)
			cb(codRes); //Executa o callback com o código retornado pelo callback do DAO
		});
	},

	excluir: function(id, cb){ //Exclui o registro cujo ID seja igual o ID fornecido pelo servidor
		var sql = "DELETE FROM TBBackup WHERE id = " + id + ";";
		var dao = require('./../dao.js');
		dao.inserir(dao.criaConexao(), sql, function(codRes){
			cb(codRes);
		});
	},

	listar: function(cb){ //Lista todos os registros da tabela;
		var sql = "SELECT * FROM TBBackup;";
		var dao = require('./../dao.js');
		dao.buscar(dao.criaConexao(), sql, function(resultado){
			cb(resultado);
		});
	},

	buscar: function(argumentos, cb){ //Busca registros na tabela baseado nos argumentos recebidos pelo servidor
		var selectCampos = '*';
		var comparacoes = "";

		//Acabar de inventar busca com todos os parâmetros possiveis (join, like, etc.)
		//Para passar os valores para busca, usar algo como [{campo: nome, valor: 'Thales', operador: 'LIKE'}, {campo: idade, valor: 20, operador: >}, {campo: objetivo, valor: 'Ficar pobre', operador: <>}]
		//Usar valores padrão, por exemplo se não especificar selectCampos usar *, se não especificar operador usar '=', etc.
	}
}
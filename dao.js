module.exports = {
	criaConexao: function(){
		var mysql = require('mysql');
		
		var con = mysql.createConnection({
			host: 'localhost',
			user: 'root',
			password: '',
			database: 'DBPatrimonioSMS'
		});

		return con;
	},

	pool:
		require('mysql').createPool({
		connectionLimit: 10,
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'DBPatrimonioSMS'
	}),

	inserir: function(comando, cb){		
		//console.log("dao:inserir, comando = " + comando + "\n");
		this.pool.query(comando, function(err, res){
			//console.log("Dentro de pool.query, comando = " + comando + "\n"); (Testando a conexão por pool)
			if(err){ 
				switch(err.errno){
					case 1062:
						console.log("Erro de entrada duplicada: " + err);
						cb(418);
						return;
					case 1054:
						console.log("Campo a alterar não encontrado: " + err);
						cb(419);
						return;
					default:
						console.log(err + "\nErrno: " + err.errno);
						cb(400);
						return;
				}
			}else{				
				//console.log("Deu bom inserindo");
				cb(200, res.insertId);
				return;
			}			
		});
	},

	buscar: function(comando, cb){
		this.pool.query(comando, function(err, res){
			//console.log("Entrei em pool.query dentro de dao:buscar\n");
			if(err){console.log("Erro " + err); cb(null); return;}
			else{				
				//console.log("Deu bom buscando");
				cb(res);
				return;
			}
		});
	},

	email: function(email, mensagem, assunto, cb){
		var nodemailer = require('nodemailer');
		var transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'info.saude@gmail.com',
				pass: 'senhaEmail123'
			}
		});

		const mailOptions = {
			from: 'email@gmail.com',
			to: email,
			subject: assunto,
			html: mensagem
		};

		transporter.sendMail(mailOptions, function(err, info){
			if(err){
				console.log(err);
				cb(400);				
			}else{
				console.log(info);
				cb(200);
			}
		});
	}
}
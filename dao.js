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

	inserir: function(con, comando, cb){
		con.connect(function(err){
			if(err) throw err;
			console.log("Conectado ao banco!");
			con.query(comando, function(err, res){
				if(err){ console.log("Erro: " + err); cb(400); return;}				
				console.log("Deu bom inserindo");
				con.destroy();
				cb(200);
			});
		});
	},

	buscar: function(con, comando, cb){
		con.connect(function(err){
			if(err) throw err;
			console.log("Conectado ao banco!");
			con.query(comando, function(err, res){
				if(err){console.log("Erro " + err); cb(null); return;}
				console.log("Deu bom buscando");
				con.destroy();
				cb(res);
			});
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
			from: 'sistema.pronn@gmail.com',
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
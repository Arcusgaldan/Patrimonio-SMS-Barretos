function tokenAleatorio(){
    var possible = "ABCDEF0123456789";
    var text = "";

    for (var i = 0; i < 8; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

var http = require('http');

var vetorTokens = [];

http.createServer(function(req, res) {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
    res.setHeader('Access-Control-Allow-Credentials', "true");
    res.setHeader('Access-Control-Allow-Methods', 'OPTION, GET, POST');    
    res.setHeader('Accept-Encoding', 'gzip, deflate, br');
    res.setHeader('Accept-Language', 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7');
    res.setHeader('Accept', "text/plain");
    if(req.method == 'OPTIONS'){ //Se for um pacote preflight de segurança, envia cabeçalhos de aceitação somente
        //console.log("Método é options, cabeçalhos da requisição são " + JSON.stringify(req.headers));
        res.setHeader('Access-Control-Allow-Headers', req.headers["access-control-request-headers"]);
        res.end();
        return;
    }

    var msgRqs = "";
    var jsonRqs;
    console.log("Pacote recebido!");
    req.on('readable', function(){
        var texto = req.read();
        //console.log("TEXTO: " + texto);
        if(texto != null){
            msgRqs += texto; //Lê o corpo da mensagem da requisição
        }
    });

    req.on('end', function(){
    	if(msgRqs != ""){    		
    		jsonRqs = JSON.parse(msgRqs); //Se houver texto, transforma em JSON	
    	}

        if(req.headers['objeto'] == "Token"){
            switch(req.headers['operacao']){
                case 'CRIAR':
                    require('./controller/controller.js').buscar("TBUsuario", {where: "email = " + jsonRqs.email + " AND senha = " + jsonRqs.senha}, function(resposta){
                        if(resposta.length > 0){
                            var token = tokenAleatorio();
                            vetorTokens[token] = resposta[0];
                            res.statusCode = 200;
                            res.write(token);
                            res.end();
                        }else{
                            res.statusCode(411);
                            res.end();
                        }
                    });
                    break;

                case 'EXCLUIR':
                    if(jsonRqs && jsonRqs.token){
                        if(vetorTokens[jsonRqs.token]){
                            vetorTokens[jsonRqs.token] = null;
                            res.statusCode = 200;
                            res.end();
                        }else{
                            res.statusCode = 400;
                            res.end();
                        }
                    }else{
                        res.statusCode = 400;
                        res.end();
                    }
                    break;

                case 'VALIDAR':
                    if(jsonRqs && jsonRqs.token){
                        if(vetorTokens[jsonRqs.token]){
                            res.statusCode = 200;
                            res.end();
                        }else{
                            res.statusCode = 400;
                            res.end();
                        }
                    }else{
                        res.statusCode = 400;
                        res.end();
                    }

                default:
                    res.statusCode = 410;
                    res.end();
                    break;
            }
            return;
        }else{
            var usuario;
            if(jsonRqs){
                usuario = vetorTokens[jsonRqs.token];
            }else{
                usuario = null;
            }
        	require('./controller/c' + req.headers['objeto'] + '.js').trataOperacao(usuario, req.headers['operacao'], jsonRqs, function(resposta){ //Puxa a ação relativa ao objeto e operação
        		console.log("Acabou a execução do trataOperacao!");
        		res.statusCode = resposta.codigo;
        		if(resposta.msg){
        			res.write(resposta.msg);
        		}
        		res.end();
        	});
        }
    });
}).listen(8080);
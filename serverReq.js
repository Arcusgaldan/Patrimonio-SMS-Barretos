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

        if(req.headers['objeto'] == "Token"){ //Para operações relacionadas ao token é necessária a execução neste módulo para que os dados existam até o término da execução do servidor
            switch(req.headers['operacao']){
                case 'CRIAR': //Se a operação for criação de token, entra aqui
                    if(!jsonRqs){ //Se não houver um corpo da requisição, retorna erro de login ou senha inválidos.
                        res.statusCode(411);
                        res.end();
                        return;
                    }else if(!jsonRqs.email || !jsonRqs.senha){ //Se não houver email ou senha no corpo da requisição, retorna erro de login ou senha inválidos.
                        res.statusCode(411);
                        res.end();
                        return;
                    }else{ //Se existir email e senha, verifica validade
                        require('./controller/controller.js').buscar("Usuario", {where: "email = '" + jsonRqs.email + "' AND senha = '" + jsonRqs.senha + "'"}, function(resposta){ //Busca algum usuário com esta senha e email
                            if(!resposta){ //Se não houver resposta, retorna erro de login ou senha inválidos.
                                res.statusCode = 411;
                                res.end();
                                return;
                            }else if(resposta.length > 0){ //Se houver resposta, entra aqui
                                var token;
                                while(true){ //Gera o token para o usuário; o laço garante que não haverão dois tokens iguais ao mesmo tempo
                                    token = tokenAleatorio();
                                    if(!vetorTokens[token])
                                        break;
                                }
                                vetorTokens[token] = resposta[0];
                                res.statusCode = 200;
                                res.write(token);
                                res.end();
                                return;
                            }else{ //Se não houver resposta, retorna erro de login ou senha inválidos.
                                res.statusCode = 411;
                                res.end();
                                return;
                            }
                        });
                    }
                    break;

                case 'EXCLUIR': //Se a operação for exclusão de token, entra aqui
                    if(jsonRqs && jsonRqs.token){ //Verifica se há um corpo de requisição e se nesse corpo existe um campo token
                        if(vetorTokens[jsonRqs.token]){ //Verifica se o token recebido está registrado no vetor e o apaga
                            vetorTokens[jsonRqs.token] = null;
                            res.statusCode = 200;
                            res.end();
                        }else{ //Se não estiver registrado, retorna erro
                            res.statusCode = 400;
                            res.end();
                        }
                    }else{ //Se o corpo estiver incorreto, retorna erro
                        res.statusCode = 400;
                        res.end();
                    }
                    break;

                case 'VALIDAR': //Se a operação for validação de token, entra aqui
                    if(jsonRqs && jsonRqs.token){ //Verifica se há um corpo de requisição e se nesse corpo existe um campo token
                        if(vetorTokens[jsonRqs.token]){ //Verifica se o token recebido está registrado no vetor e se sim, retorna sucesso
                            res.statusCode = 200;
                            res.end();
                        }else{ //Se não estiver registrado, retorna erro
                            res.statusCode = 400;
                            res.end();
                        }
                    }else{ //Se o corpo estiver incorreto, retorna erro
                        res.statusCode = 400;
                        res.end();
                    }

                default: //Se não foi nenhuma das operações acima, retorna erro de operação ou objeto inválidos.
                    res.statusCode = 410;
                    res.end();
                    break;
            }
            return;
        }else{
            var usuario;
            if(jsonRqs && jsonRqs.token){ //Se houver corpo de requisição e um campo token neste corpo, puxa o usuário no vetor
                usuario = vetorTokens[jsonRqs.token];
            }else{ //Se não houver corpo e/ou campo token, passa null no parâmetro usuario
                usuario = null;
            }
            if(!require('fs').existsSync('/controller/c' + req.headers['objeto'] + '.js')){ //Verifica se existe um controller pro objeto requisitado e se não houver, retorna erro de objeto ou operação inválidos
                res.statusCode = 410;
                res.end();
                return;
            }else{
            	require('./controller/c' + req.headers['objeto'] + '.js').trataOperacao(usuario, req.headers['operacao'], jsonRqs, function(resposta){ //Puxa a ação relativa ao objeto e operação
            		console.log("Acabou a execução do trataOperacao!");
            		res.statusCode = resposta.codigo;
            		if(resposta.msg){
            			res.write(resposta.msg);
            		}
            		res.end();
            	});
            }
        }
    });
}).listen(8080);
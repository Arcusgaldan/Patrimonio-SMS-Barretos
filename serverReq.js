var http = require('http');

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
    	if(msgTxt != ""){    		
    		jsonRqs = JSON.parse(msgRqs); //Se houver texto, transforma em JSON	
    	}
    	//Fazer parte de token e validação de token para passar como primeiro parâmetro: true se for usuário, false se não
    	require('./controller/c' + req.headers['objeto'] + '.js').trataOperacao(false, req.headers['operacao'], jsonRqs, function(resposta){ //Puxa a ação relativa ao objeto e operação

    	});
    });
}).listen(8080);
var http = require('http');

var dados = {
    //selectCampos: ["nomePasta", "data"],
    //joins: [{tabela: "TBComputador", on: "TBComputador.id = TBBackup.codComputador"}],
    where: "TBBackup.id = 1"
};

var texto = JSON.stringify(dados);
console.log("Texto: " + texto);


//var texto = JSON.stringify(dados);
var opcoes = {
    hostname: "127.0.0.1",
    port: 8080,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',    
      'Content-Length': Buffer.byteLength(texto),
      'Objeto': 'Backup',
      'Operacao': 'BUSCAR'
    }
};



var req = http.request(opcoes, (res) => {
    console.log("Chegou a resposta!");
    res.setEncoding('utf8');
    //console.log(res);        
    if(res.statusCode == 200){
        var msg = "";
        res.on('data', function(chunk) {
            msg += chunk;
        });
        res.on('end', function(){
            console.log("Fim da resposta: " + msg);
        });
    }
});    

//req.on('error', (e) => {
//  console.error(`problem with request: ${e.message}`);
//});

//console.log(texto);
try{
    req.write(texto);
    //console.log("Escrevi texto");
    req.end();
    //console.log("Mandei texto");
}catch(er){
    console.log("ERROZAO DA PORRA");
}
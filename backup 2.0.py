import mysql.connector
from datetime import datetime
from datetime import date

tabelas = ["tbtipoitem", "tbprocessador", "tbsistemaoperacional", "tbdiscobackup", "tbusuario", "tblocal", "tbitem", "tbsetor", "tblogtransferencia", "tbcomputador", "tbprocedimento", "tbbackup", "tblog"]

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="",
  database="dbpatrimoniosms"
)

paramDataAtual = datetime.today()

#TODO: Remover duplicados (dropar banco antes de subir backup?), remover colunas excluídas do banco atual (rodar codigoSql.sql)

stringTotal = ""
flagTeste = False

for x in tabelas:
  tabela = x
  query = mydb.cursor()
  query.execute("SELECT * FROM " + tabela)
  resultados = query.fetchall()
  
  if not resultados:
      query.close()
      continue

  for resultado in resultados:
    resultadoList = list(resultado)
    for i in range(len(resultadoList)):
      if isinstance(resultadoList[i], datetime):
        resultadoList[i] = resultadoList[i].strftime("%Y-%m-%dT%I%M%S") 
        print("Achei datetime")
      elif isinstance(resultadoList[i], date):
        resultadoList[i] = resultadoList[i].strftime("%Y-%m-%d")
        print("Achei date")
      
    resultadoFinal = tuple(resultadoList)
    
    stringAtual = "INSERT INTO " + tabela + " VALUES "
    stringAtual += str(resultadoFinal) + ";\n"
    stringTotal += stringAtual
  
  stringTotal += "\n"
  query.close()
  
stringTotal = stringTotal.replace('None', 'NULL')
with open('X:\\backup ' + paramDataAtual.strftime("%d.%m.%Y") + '.sql', 'w') as arquivo:
    arquivo.write(stringTotal)
#print(stringTotal)

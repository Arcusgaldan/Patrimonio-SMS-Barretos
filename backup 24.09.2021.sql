INSERT INTO tbtipoitem VALUES
(1, 'PC'),
(2, 'Monitor');

INSERT INTO tbprocessador VALUES
(1, 'i5 7400');

INSERT INTO tbsistemaoperacional VALUES
(1, 'W10');

INSERT INTO tbusuario VALUES
(1, 'Administrador3', '123.456.789-10', 'admin@email.com', 'bd7822c76f3ca74cd699115b8128cbcb2c908ae53f2078bce4b5abd901401818', 0),
(5, 'teste', NULL, 'teste@email.com', '46070d4bf934fb0d4b06d9e2c46e346944e322444900a435d7d9a95e6d7435f5', 1);

INSERT INTO tblocal VALUES
(1, 'UBS Pimenta', 'Rua Pimenta, 20', '', 'Lucineia'),
(2, 'Unidade Basica de Saude - Marilia', 'Rua Marilia, 30', '', 'Giannini');

INSERT INTO tbitem VALUES
(1, '078555', 'LG', 'Flatron', ' Teste', 2, 1),
(2, '000000', 'HP', 'DeskMon', ' ', 2, 1),
(3, '080800', '', '', ' ', 2, 1),
(4, '080811', 'Dell', 'Optitron', ' ', 1, 1);

INSERT INTO tbsetor VALUES
(1, 'Almoxarifado', '', 1),
(2, 'Farmacia', NULL, 2);

INSERT INTO tblogtransferencia VALUES
(1, '2021-09-01T064511', 1, 1, 1, 0),
(2, '2021-09-01T075042', 2, 1, 1, 1),
(3, '2021-09-01T112152', 1, 1, NULL, 1),
(4, '2021-09-04T034822', 3, 2, NULL, 1),
(5, '2021-09-06T010653', 4, 1, 1, 0),
(6, '2021-09-06T020921', 4, 1, 1, 1);

INSERT INTO tbcomputador VALUES
(1, 8, 'DDR3', 240, 4, 0, 1, 1, 1);

INSERT INTO tbprocedimento VALUES
(2, 'HD', 'Troca de HD e SATA ', '2021-09-07', 1);

INSERT INTO tblog VALUES
(1, 1, 'TBUsuario', 'ALTERAR', "{'id':1,'nome':'Administrador1','cpf':'123.456.789-10','email':'admin@email.com','senha':'bd7822c76f3ca74cd699115b8128cbcb2c908ae53f2078bce4b5abd901401818','senhaExpirada':0,'contInc':'3'}", '2021-08-31T074158', 1),
(2, 1, 'TBUsuario', 'ALTERAR', "{'id':1,'nome':'Administrador2','cpf':'123.456.789-10','email':'admin@email.com','senha':'bd7822c76f3ca74cd699115b8128cbcb2c908ae53f2078bce4b5abd901401818','senhaExpirada':1,'contInc':'4'}", '2021-08-31T074651', 1),
(3, 2, 'TBUsuario', 'INSERIR', "{'id':2,'nome':'Thales de Mattos','email':'thales@email.com','senha':'bd7822c76f3ca74cd699115b8128cbcb2c908ae53f2078bce4b5abd901401818','senhaExpirada':1,'contInc':'1'}", '2021-08-31T080531', 1),
(4, 2, 'TBUsuario', 'ALTERAR', "{'id':2,'nome':'Thales de Mattos Gonçalves','email':'thales@email.com','senha':'bd7822c76f3ca74cd699115b8128cbcb2c908ae53f2078bce4b5abd901401818','senhaExpirada':1,'contInc':'2'}", '2021-08-31T080623', 1),
(5, 2, 'TBUsuario', 'ALTERAR', "{'id':2,'nome':'Thales de Mattos Gonçalves','email':'thalesmattos@email.com','senha':'bd7822c76f3ca74cd699115b8128cbcb2c908ae53f2078bce4b5abd901401818','senhaExpirada':1,'contInc':'3'}", '2021-08-31T080631', 1),
(6, 2, 'TBUsuario', 'EXCLUIR', '-', '2021-08-31T081420', 1),
(7, 2, 'TBUsuario', 'INSERIR', "{'id':2,'nome':'thales de m','email':'thalesm@email.com','senha':'bd7822c76f3ca74cd699115b8128cbcb2c908ae53f2078bce4b5abd901401818','senhaExpirada':1,'contInc':'1'}", '2021-09-01T063856', 1),
(8, 3, 'TBUsuario', 'ALTERAR', "{'id':3,'nome':'thales de mattos','email':'thalesmattos@email.com','senha':'b48c4e97bc3e64b7d5696b73f1a116457be65c48d3de535f58f1a79bbf3f903c','senhaExpirada':1,'contInc':'2'}", '2021-09-01T063919', 1),
(9, 3, 'TBUsuario', 'EXCLUIR', '-', '2021-09-01T063925', 1),
(10, 1, 'TBUsuario', 'ALTERAR', "{'id':1,'nome':'Administrador1','email':'admin@email.com','senha':'bd7822c76f3ca74cd699115b8128cbcb2c908ae53f2078bce4b5abd901401818','senhaExpirada':1,'contInc':'1'}", '2021-09-01T063955', 1),
(11, 1, 'TBLocal', 'INSERIR', "{'id':1,'nome':'UBS Pimenta','coordenador':'Lucineia','endereco':'Rua Pimenta, 20','telefone':'','contInc':'5'}", '2021-09-01T064238', 1),
(12, 1, 'TBSetor', 'INSERIR', "{'id':1,'nome':'Almoxarifado','sigla':'','codLocal':'1','contInc':'6'}", '2021-09-01T064243', 1),
(13, 1, 'TBLocal', 'INSERIR', "{'id':1,'nome':'UBS Marilia','coordenador':'Giannini','endereco':'Rua Marilia, 30','telefone':'','contInc':'7'}", '2021-09-01T064331', 1),
(14, 2, 'TBLocal', 'ALTERAR', "{'id':'2','nome':'Unidade Basica de Saude - Marilia','coordenador':'Giannini','endereco':'Rua Marilia, 30','telefone':'','contInc':'10'}", '2021-09-01T064354', 1),
(15, 1, 'TBItem', 'INSERIR', "{'id':1,'patrimonio':'078555','marca':'LG','modelo':'Flatron','descricao':' ','codTipoItem':'2','ativo':1,'contInc':'13'}", '2021-09-01T064511', 1),
(16, 1, 'TBLogTransferencia', 'INSERIR', "{'id':1,'data':'2021-09-01 18:45:11','codSetor':'1','codItem':'1','codLocal':'1','atual':1,'contInc':'14'}", '2021-09-01T064511', 1),
(17, 1, 'TBUsuario', 'ALTERAR', "{'id':1,'nome':'Administrador0','email':'admin@email.com','senha':'bd7822c76f3ca74cd699115b8128cbcb2c908ae53f2078bce4b5abd901401818','senhaExpirada':1,'contInc':'15'}", '2021-09-01T071509', 1),
(18, 1, 'TBUsuario', 'ALTERAR', "{'id':1,'nome':'Administrador2','email':'admin@email.com','senha':'bd7822c76f3ca74cd699115b8128cbcb2c908ae53f2078bce4b5abd901401818','senhaExpirada':1,'contInc':'16'}", '2021-09-01T071700', 1),
(19, 1, 'TBUsuario', 'ALTERAR', "{'id':1,'nome':'Administrador3','email':'admin@email.com','senha':'bd7822c76f3ca74cd699115b8128cbcb2c908ae53f2078bce4b5abd901401818','senhaExpirada':1,'contInc':'17'}", '2021-09-01T071758', 1),
(20, 2, 'TBUsuario', 'INSERIR', "{'id':2,'nome':'thales','email':'tdm@email.com','senha':'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92','senhaExpirada':1,'contInc':'18'}", '2021-09-01T071808', 1),
(21, 4, 'TBUsuario', 'EXCLUIR', '-', '2021-09-01T071814', 1),
(22, 1, 'TBItem', 'INSERIR', "{'id':1,'patrimonio':'000000','marca':'HP','modelo':'DeskMon','descricao':' ','codTipoItem':'2','ativo':1,'contInc':'22'}", '2021-09-01T075042', 1),
(23, 1, 'TBLogTransferencia', 'INSERIR', "{'id':1,'data':'2021-09-01 19:50:42','codSetor':'1','codItem':'2','codLocal':'1','atual':1,'contInc':'23'}", '2021-09-01T075042', 1),
(24, 2, 'TBUsuario', 'INSERIR', "{'id':2,'nome':'teste','email':'teste@email.com','senha':'46070d4bf934fb0d4b06d9e2c46e346944e322444900a435d7d9a95e6d7435f5','senhaExpirada':1,'contInc':'24'}", '2021-09-01T080418', 1),
(25, 1, 'TBLogTransferencia', 'ALTERAR', "{'id':1,'data':'2021-09-01 18:45:11','codItem':1,'codLocal':1,'codSetor':1,'atual':0,'contInc':'28'}", '2021-09-01T112152', 1),
(26, 1, 'TBLogTransferencia', 'INSERIR', "{'id':1,'data':'2021-09-01 23:21:52','codSetor':null,'codItem':1,'codLocal':'1','atual':1,'contInc':'29'}", '2021-09-01T112152', 1),
(27, 1, 'TBItem', 'ALTERAR', "{'id':1,'patrimonio':'078555','marca':'LG','modelo':'Flatron','descricao':' Teste','codTipoItem':'2','ativo':1,'contInc':'30'}", '2021-09-01T114058', 1),
(28, 3, 'TBItem', 'INSERIR', "{'id':3,'patrimonio':'080800','marca':'','modelo':'','descricao':' ','codTipoItem':'2','ativo':1,'contInc':'7'}", '2021-09-04T034822', 1),
(29, 4, 'TBLogTransferencia', 'INSERIR', "{'id':4,'data':'2021-09-04 15:48:22','codSetor':null,'codItem':'3','codLocal':'2','atual':1,'contInc':'8'}", '2021-09-04T034822', 1),
(30, 2, 'TBSetor', 'INSERIR', "{'id':2,'nome':'Farmacia','codLocal':'2','contInc':'9'}", '2021-09-04T040053', 1),
(31, 4, 'TBItem', 'INSERIR', "{'id':4,'patrimonio':'080811','marca':'Dell','modelo':'Optitron','descricao':' ','codTipoItem':'1','ativo':1,'contInc':'3'}", '2021-09-06T010653', 1),
(32, 5, 'TBLogTransferencia', 'INSERIR', "{'id':5,'data':'2021-09-06 01:06:53','codSetor':'1','codItem':'4','codLocal':'1','atual':1,'contInc':'4'}", '2021-09-06T010653', 1),
(33, 1, 'TBComputador', 'INSERIR', "{'id':1,'qtdMemoria':'8','tipoMemoria':'DDR4','armazenamento':'240','codItem':'4','reserva':0,'aposentado':0,'codProcessador':'1','codSO':'1','contInc':'8'}", '2021-09-06T010746', 1),
(34, 1, 'TBComputador', 'ALTERAR', "{'id':1,'qtdMemoria':'8','tipoMemoria':'DDR3','armazenamento':'240','codItem':'4','reserva':0,'aposentado':0,'codProcessador':'1','codSO':'1','contInc':'21'}", '2021-09-06T014758', 1),
(35, 1, 'TBComputador', 'ALTERAR', "{'id':1,'qtdMemoria':'8','tipoMemoria':'DDR3','armazenamento':'240','codItem':'4','reserva':0,'aposentado':1,'codProcessador':'1','codSO':'1','contInc':'7'}", '2021-09-06T020757', 1),
(36, 5, 'TBLogTransferencia', 'ALTERAR', "{'id':5,'data':'2021-09-06 01:06:53','codItem':4,'codLocal':1,'codSetor':1,'atual':0,'contInc':'15'}", '2021-09-06T020921', 1),
(37, 5, 'TBLogTransferencia', 'INSERIR', "{'id':5,'data':'2021-09-06 02:09:21','codSetor':'1','codItem':4,'codLocal':'1','atual':1,'contInc':'16'}", '2021-09-06T020921', 1),
(38, 1, 'TBProcedimento', 'INSERIR', "{'id':1,'peca':'Gabinete','descricao':'Realocação do front panel ','data':'2021-09-07','codComputador':1,'contInc':'14'}", '2021-09-07T044556', 1),
(39, 1, 'TBProcedimento', 'EXCLUIR', '-', '2021-09-07T044604', 1),
(40, 1, 'TBProcedimento', 'INSERIR', "{'id':1,'peca':'HD','descricao':'Troca de HD e SATA ','data':'2021-09-07','codComputador':1,'contInc':'27'}", '2021-09-07T054608', 1);


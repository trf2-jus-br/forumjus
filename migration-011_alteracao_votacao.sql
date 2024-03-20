ALTER TABLE votacao ADD alterado DATETIME DEFAULT NOW();

/*É necessário recriar a view 'votacao_detalhada'*/
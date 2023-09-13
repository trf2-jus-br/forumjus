/* COMANDO 1 - Atualiza COMISSÃO I */
UPDATE 
	committee 
SET 
	committee_name = 'Combate ao assédio e à discriminação por gênero ou orientação sexual', 
    committee_description='A temática objeto da comissão está relacionada com os mecanismos de prevenção e enfrentamento de todas as formas de assédio moral e sexual, bem assim da discriminação praticada contra mulheres e pessoas LGBTQIAPN+.'  
WHERE committee_id = 1;



/* COMANDO 2 - Atualiza COMISSÃO III */
UPDATE 
	committee 
SET 
	committee_name = 'Proteção contra o despejo forçado nos conflitos fundiários', 
    committee_description='A temática objeto da comissão está relacionada com a busca de soluções consensuais para os conflitos fundiários urbanos e rurais e a garantia dos direitos fundamentais das partes envolvidas em caso de reintegração de posse.'  
WHERE committee_id = 3;


/* COMANDO 3 - Atualiza COMISSÃO V */
UPDATE 
	committee 
SET 
	committee_name = 'Direito digital, acesso à informação e proteção de dados', 
    committee_description='A temática objeto da comissão está voltada à discussão quanto às questões e os desafios relacionados ao uso da tecnologia da informação e da internet, incluindo tópicos como acesso à informação, privacidade, proteção de dados, processo digital, propriedade intelectual, direitos autorais e temas correlatos.'  
WHERE committee_id = 5;
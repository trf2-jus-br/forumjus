CREATE DATABASE forumjus;

CREATE TABLE `forumjus`.`election` (
  `election_id` INT NOT NULL AUTO_INCREMENT,
  `election_name` VARCHAR(255) NOT NULL,
  `election_administrator_email` VARCHAR(45) NOT NULL,
  `election_start` DATETIME NULL,
  `election_end` DATETIME NULL,
  PRIMARY KEY (`election_id`));

CREATE TABLE `forumjus`.`voter` (
  `voter_id` INT NOT NULL AUTO_INCREMENT,
  `election_id` INT NOT NULL,
  `voter_name` VARCHAR(255) NOT NULL,
  `voter_email` VARCHAR(255) NOT NULL,
  `voter_vote_datetime` DATETIME NULL,
  `voter_vote_ip` VARCHAR(45) NULL,
  PRIMARY KEY (`voter_id`));

CREATE TABLE `forumjus`.`candidate` (
  `candidate_id` INT NOT NULL AUTO_INCREMENT,
  `election_id` INT NOT NULL,
  `candidate_name` VARCHAR(255) NOT NULL,
  `candidate_votes` INT NOT NULL,
  PRIMARY KEY (`candidate_id`));

CREATE TABLE `forumjus`.`forum` (
  `forum_id` INT NOT NULL AUTO_INCREMENT,
  `forum_name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`forum_id`));

INSERT INTO `forumjus`.`forum` VALUES(1, 'Fórum de Direitos Humanos e Fundamentais da Justiça Federal da 2ª Região');

CREATE TABLE `forumjus`.`occupation` (
  `occupation_id` INT NOT NULL AUTO_INCREMENT,
  `forum_id` INT NOT NULL,
  `occupation_name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`occupation_id`),
  FOREIGN KEY (`forum_id`) REFERENCES `forumjus`.`forum`(`forum_id`));

INSERT INTO `forumjus`.`occupation` VALUES(1, 1, 'Magistrado(a)');
INSERT INTO `forumjus`.`occupation` VALUES(2, 1, 'Procurador(a)');
INSERT INTO `forumjus`.`occupation` VALUES(3, 1, 'Integrante da Administração Pública');
INSERT INTO `forumjus`.`occupation` VALUES(4, 1, 'Advogado(a)');
INSERT INTO `forumjus`.`occupation` VALUES(5, 1, 'Acadêmico(a)');
INSERT INTO `forumjus`.`occupation` VALUES(6, 1, 'Outros');

CREATE TABLE `forumjus`.`committee` (
  `committee_id` INT NOT NULL AUTO_INCREMENT,
  `forum_id` INT NOT NULL,
  `committee_name` VARCHAR(255) NOT NULL,
  `committee_chair_name` VARCHAR(255) NOT NULL,
  `committee_chair_document` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`committee_id`),
  FOREIGN KEY (`forum_id`) REFERENCES `forumjus`.`forum`(`forum_id`));

INSERT INTO `forumjus`.`committee` VALUES(1, 1, 'Comissão 1', 'Chair 1', '111.111.111-11');
INSERT INTO `forumjus`.`committee` VALUES(2, 1, 'Comissão 2', 'Chair 2', '111.111.111-11');
INSERT INTO `forumjus`.`committee` VALUES(3, 1, 'Comissão 3', 'Chair 3', '111.111.111-11');

CREATE TABLE `forumjus`.`attendee` (
  `attendee_id` INT NOT NULL AUTO_INCREMENT,
  `forum_id` INT NOT NULL,
  `occupation_id` INT NOT NULL,
  `committee_id` INT NULL,
  `attendee_name` VARCHAR(255) NOT NULL,
  `attendee_email` VARCHAR(255) NOT NULL,
  `attendee_document` VARCHAR(255) NOT NULL,
  `attendee_affiliation` VARCHAR(255) NULL,
  `attendee_acceptance_datetime` DATETIME NULL,
  `attendee_rejection_datetime` DATETIME NULL,
  PRIMARY KEY (`attendee_id`),
  FOREIGN KEY (`forum_id`) REFERENCES `forumjus`.`forum`(`forum_id`),
  FOREIGN KEY (`occupation_id`) REFERENCES `forumjus`.`occupation`(`occupation_id`),
  FOREIGN KEY (`committee_id`) REFERENCES `forumjus`.`committee`(`committee_id`));

CREATE TABLE `forumjus`.`statement` (
  `statement_id` INT NOT NULL AUTO_INCREMENT,
  `forum_id` INT NOT NULL,
  `attendee_id` INT NOT NULL,
  `committee_id` INT NOT NULL,
  `statement_text` VARCHAR(1024) NOT NULL,
  `statement_justification` VARCHAR(2048) NOT NULL,
  `statement_acceptance_datetime` DATETIME NULL,
  `statement_rejection_datetime` DATETIME NULL,
  PRIMARY KEY (`statement_id`),
  FOREIGN KEY (`forum_id`) REFERENCES `forumjus`.`forum`(`forum_id`),
  FOREIGN KEY (`attendee_id`) REFERENCES `forumjus`.`attendee`(`attendee_id`),
  FOREIGN KEY (`committee_id`) REFERENCES `forumjus`.`committee`(`committee_id`));



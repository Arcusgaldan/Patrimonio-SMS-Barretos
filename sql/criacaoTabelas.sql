-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema DBPatrimonioSMS
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `DBPatrimonioSMS` ;

-- -----------------------------------------------------
-- Schema DBPatrimonioSMS
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `DBPatrimonioSMS` DEFAULT CHARACTER SET utf8 ;
USE `DBPatrimonioSMS` ;

-- -----------------------------------------------------
-- Table `DBPatrimonioSMS`.`TBTipoItem`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `DBPatrimonioSMS`.`TBTipoItem` ;

CREATE TABLE IF NOT EXISTS `DBPatrimonioSMS`.`TBTipoItem` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `ativo` TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `DBPatrimonioSMS`.`TBItem`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `DBPatrimonioSMS`.`TBItem` ;

CREATE TABLE IF NOT EXISTS `DBPatrimonioSMS`.`TBItem` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `patrimonio` CHAR(6) NOT NULL,
  `marca` VARCHAR(100) NULL,
  `modelo` VARCHAR(100) NULL,
  `descricao` TEXT NULL,
  `codTipoItem` INT NOT NULL,
  `ativo` TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`, `codTipoItem`),
  INDEX `fk_TBItem_TBTipoItem_idx` (`codTipoItem` ASC) VISIBLE,
  CONSTRAINT `fk_TBItem_TBTipoItem`
    FOREIGN KEY (`codTipoItem`)
    REFERENCES `DBPatrimonioSMS`.`TBTipoItem` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `DBPatrimonioSMS`.`TBLocal`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `DBPatrimonioSMS`.`TBLocal` ;

CREATE TABLE IF NOT EXISTS `DBPatrimonioSMS`.`TBLocal` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `endereco` TEXT NOT NULL,
  `telefone` VARCHAR(20) NOT NULL,
  `coordenador` VARCHAR(100) NOT NULL,
  `ativo` TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `DBPatrimonioSMS`.`TBSetor`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `DBPatrimonioSMS`.`TBSetor` ;

CREATE TABLE IF NOT EXISTS `DBPatrimonioSMS`.`TBSetor` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `codLocal` INT NOT NULL,
  `ativo` TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`, `codLocal`),
  INDEX `fk_TBSetor_TBLocal1_idx` (`codLocal` ASC) VISIBLE,
  CONSTRAINT `fk_TBSetor_TBLocal1`
    FOREIGN KEY (`codLocal`)
    REFERENCES `DBPatrimonioSMS`.`TBLocal` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `DBPatrimonioSMS`.`TBProcessador`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `DBPatrimonioSMS`.`TBProcessador` ;

CREATE TABLE IF NOT EXISTS `DBPatrimonioSMS`.`TBProcessador` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(200) NOT NULL,
  `ativo` TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `nome_UNIQUE` (`nome` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `DBPatrimonioSMS`.`TBSistemaOperacional`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `DBPatrimonioSMS`.`TBSistemaOperacional` ;

CREATE TABLE IF NOT EXISTS `DBPatrimonioSMS`.`TBSistemaOperacional` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(200) NOT NULL,
  `ativo` TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `nome_UNIQUE` (`nome` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `DBPatrimonioSMS`.`TBComputador`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `DBPatrimonioSMS`.`TBComputador` ;

CREATE TABLE IF NOT EXISTS `DBPatrimonioSMS`.`TBComputador` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `qtdMemoria` INT NULL,
  `tipoMemoria` CHAR(4) NULL,
  `armazenamento` INT NULL,
  `codItem` INT NOT NULL,
  `reserva` TINYINT NOT NULL,
  `aposentado` TINYINT NOT NULL,
  `codProcessador` INT NULL,
  `codSO` INT NULL,
  PRIMARY KEY (`id`, `codItem`),
  INDEX `fk_TBComputador_TBItem1_idx` (`codItem` ASC) VISIBLE,
  INDEX `fk_TBComputador_TBProcessador1_idx` (`codProcessador` ASC) VISIBLE,
  INDEX `fk_TBComputador_TBSistemaOperacional1_idx` (`codSO` ASC) VISIBLE,
  CONSTRAINT `fk_TBComputador_TBItem1`
    FOREIGN KEY (`codItem`)
    REFERENCES `DBPatrimonioSMS`.`TBItem` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_TBComputador_TBProcessador1`
    FOREIGN KEY (`codProcessador`)
    REFERENCES `DBPatrimonioSMS`.`TBProcessador` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_TBComputador_TBSistemaOperacional1`
    FOREIGN KEY (`codSO`)
    REFERENCES `DBPatrimonioSMS`.`TBSistemaOperacional` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `DBPatrimonioSMS`.`TBLogTransferencia`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `DBPatrimonioSMS`.`TBLogTransferencia` ;

CREATE TABLE IF NOT EXISTS `DBPatrimonioSMS`.`TBLogTransferencia` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `data` DATETIME NOT NULL,
  `codItem` INT NOT NULL,
  `codLocal` INT NOT NULL,
  `codSetor` INT NULL,
  `atual` TINYINT NOT NULL,
  PRIMARY KEY (`id`, `codItem`, `codLocal`),
  INDEX `fk_TBLogTransferencia_TBItem1_idx` (`codItem` ASC) VISIBLE,
  INDEX `fk_TBLogTransferencia_TBLocal1_idx` (`codLocal` ASC) VISIBLE,
  INDEX `fk_TBLogTransferencia_TBSetor1_idx` (`codSetor` ASC) VISIBLE,
  CONSTRAINT `fk_TBLogTransferencia_TBItem1`
    FOREIGN KEY (`codItem`)
    REFERENCES `DBPatrimonioSMS`.`TBItem` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_TBLogTransferencia_TBLocal1`
    FOREIGN KEY (`codLocal`)
    REFERENCES `DBPatrimonioSMS`.`TBLocal` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_TBLogTransferencia_TBSetor1`
    FOREIGN KEY (`codSetor`)
    REFERENCES `DBPatrimonioSMS`.`TBSetor` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `DBPatrimonioSMS`.`TBDiscoBackup`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `DBPatrimonioSMS`.`TBDiscoBackup` ;

CREATE TABLE IF NOT EXISTS `DBPatrimonioSMS`.`TBDiscoBackup` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `local` VARCHAR(100) NOT NULL,
  `tamanho` FLOAT NOT NULL,
  `observacao` TEXT NULL,
  `ativo` TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `DBPatrimonioSMS`.`TBBackup`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `DBPatrimonioSMS`.`TBBackup` ;

CREATE TABLE IF NOT EXISTS `DBPatrimonioSMS`.`TBBackup` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `data` DATETIME NOT NULL,
  `nomePasta` VARCHAR(80) NOT NULL,
  `tamanho` FLOAT NOT NULL,
  `codComputador` INT NOT NULL,
  `codDisco` INT NOT NULL,
  `observacao` TEXT NULL,
  PRIMARY KEY (`id`, `codComputador`, `codDisco`),
  INDEX `fk_TBBackup_TBComputador1_idx` (`codComputador` ASC) VISIBLE,
  INDEX `fk_TBBackup_TBDiscoBackup1_idx` (`codDisco` ASC) VISIBLE,
  CONSTRAINT `fk_TBBackup_TBComputador1`
    FOREIGN KEY (`codComputador`)
    REFERENCES `DBPatrimonioSMS`.`TBComputador` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_TBBackup_TBDiscoBackup1`
    FOREIGN KEY (`codDisco`)
    REFERENCES `DBPatrimonioSMS`.`TBDiscoBackup` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `DBPatrimonioSMS`.`TBProcedimento`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `DBPatrimonioSMS`.`TBProcedimento` ;

CREATE TABLE IF NOT EXISTS `DBPatrimonioSMS`.`TBProcedimento` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `peca` VARCHAR(80) NOT NULL,
  `descricao` TEXT NOT NULL,
  `data` DATE NOT NULL,
  `codComputador` INT NOT NULL,
  `setorOrigem` INT NOT NULL,
  PRIMARY KEY (`id`, `codComputador`),
  INDEX `fk_TBProcedimento_TBComputador1_idx` (`codComputador` ASC) VISIBLE,
  CONSTRAINT `fk_TBProcedimento_TBComputador1`
    FOREIGN KEY (`codComputador`)
    REFERENCES `DBPatrimonioSMS`.`TBComputador` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `DBPatrimonioSMS`.`TBUsuario`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `DBPatrimonioSMS`.`TBUsuario` ;

CREATE TABLE IF NOT EXISTS `DBPatrimonioSMS`.`TBUsuario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `senha` CHAR(64) NOT NULL,
  `senhaExpirada` TINYINT NOT NULL,
  `ativo` TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `DBPatrimonioSMS`.`TBLog`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `DBPatrimonioSMS`.`TBLog` ;

CREATE TABLE IF NOT EXISTS `DBPatrimonioSMS`.`TBLog` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `chave` INT NOT NULL,
  `tabela` VARCHAR(45) NOT NULL,
  `operacao` VARCHAR(45) NOT NULL,
  `mudanca` TEXT NOT NULL,
  `data` DATETIME NOT NULL,
  `codUsuario` INT NOT NULL,
  PRIMARY KEY (`id`, `codUsuario`),
  INDEX `fk_TBLog_TBUsuario1_idx` (`codUsuario` ASC) VISIBLE,
  CONSTRAINT `fk_TBLog_TBUsuario1`
    FOREIGN KEY (`codUsuario`)
    REFERENCES `DBPatrimonioSMS`.`TBUsuario` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

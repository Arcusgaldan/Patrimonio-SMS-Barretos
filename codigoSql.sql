-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema DBPatrimonioSMS
-- -----------------------------------------------------

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
  PRIMARY KEY (`id`, `codTipoItem`),
  UNIQUE INDEX `patrimonio_UNIQUE` (`patrimonio` ASC),
  INDEX `fk_TBItem_TBTipoItem_idx` (`codTipoItem` ASC),
  CONSTRAINT `fk_TBItem_TBTipoItem`
    FOREIGN KEY (`codTipoItem`)
    REFERENCES `DBPatrimonioSMS`.`TBTipoItem` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `DBPatrimonioSMS`.`TBSetor`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `DBPatrimonioSMS`.`TBSetor` ;

CREATE TABLE IF NOT EXISTS `DBPatrimonioSMS`.`TBSetor` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `local` VARCHAR(100) NOT NULL,
  `sigla` VARCHAR(20) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `DBPatrimonioSMS`.`TBComputador`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `DBPatrimonioSMS`.`TBComputador` ;

CREATE TABLE IF NOT EXISTS `DBPatrimonioSMS`.`TBComputador` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `processador` VARCHAR(100) NULL,
  `qtdMemoria` INT NULL,
  `tipoMemoria` CHAR(4) NULL,
  `armazenamento` INT NULL,
  `SO` VARCHAR(45) NULL,
  `codItem` INT NOT NULL,
  `reserva` TINYINT NOT NULL,
  `aposentado` TINYINT NOT NULL,
  PRIMARY KEY (`id`, `codItem`),
  INDEX `fk_TBComputador_TBItem1_idx` (`codItem` ASC),
  CONSTRAINT `fk_TBComputador_TBItem1`
    FOREIGN KEY (`codItem`)
    REFERENCES `DBPatrimonioSMS`.`TBItem` (`id`)
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
  `codSetor` INT NOT NULL,
  `codItem` INT NOT NULL,
  PRIMARY KEY (`id`, `codSetor`, `codItem`),
  INDEX `fk_TBLogTransferencia_TBSetor1_idx` (`codSetor` ASC),
  INDEX `fk_TBLogTransferencia_TBItem1_idx` (`codItem` ASC),
  CONSTRAINT `fk_TBLogTransferencia_TBSetor1`
    FOREIGN KEY (`codSetor`)
    REFERENCES `DBPatrimonioSMS`.`TBSetor` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_TBLogTransferencia_TBItem1`
    FOREIGN KEY (`codItem`)
    REFERENCES `DBPatrimonioSMS`.`TBItem` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `DBPatrimonioSMS`.`TBBackup`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `DBPatrimonioSMS`.`TBBackup` ;

CREATE TABLE IF NOT EXISTS `DBPatrimonioSMS`.`TBBackup` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `data` DATE NOT NULL,
  `local` VARCHAR(80) NOT NULL,
  `nomePasta` VARCHAR(80) NOT NULL,
  `tamanho` INT NULL,
  `codComputador` INT NOT NULL,
  PRIMARY KEY (`id`, `codComputador`),
  INDEX `fk_TBBackup_TBComputador1_idx` (`codComputador` ASC),
  CONSTRAINT `fk_TBBackup_TBComputador1`
    FOREIGN KEY (`codComputador`)
    REFERENCES `DBPatrimonioSMS`.`TBComputador` (`id`)
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
  PRIMARY KEY (`id`, `codComputador`),
  INDEX `fk_TBProcedimento_TBComputador1_idx` (`codComputador` ASC),
  CONSTRAINT `fk_TBProcedimento_TBComputador1`
    FOREIGN KEY (`codComputador`)
    REFERENCES `DBPatrimonioSMS`.`TBComputador` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

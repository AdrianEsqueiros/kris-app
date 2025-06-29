ALTER TABLE `registros_clinicos`
ADD COLUMN `suplementacion` TINYINT(1) DEFAULT NULL,
ADD COLUMN `cred` TINYINT(1) DEFAULT NULL,
ADD COLUMN `tipo_eess` ENUM('Posta','CentroSalud','Hospital') DEFAULT NULL,
ADD COLUMN `red_simple` ENUM('AREQUIPA','CASTILLA','ISLAY','CAMANA','NO') DEFAULT NULL,
ADD COLUMN `grupo_edad` ENUM('<6m','6-24m','24-59m','≥60m') DEFAULT NULL,
ADD COLUMN `suppl_x_edadgrupo` VARCHAR(20) DEFAULT NULL,
ADD COLUMN `sexo_x_juntos` VARCHAR(10) DEFAULT NULL,
ADD COLUMN `indice_social` INT DEFAULT NULL;

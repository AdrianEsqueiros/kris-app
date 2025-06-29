CREATE DEFINER = `admin` @`%` PROCEDURE `test`.`sp_registrar_paciente`( IN p_id INT, IN p_nombre VARCHAR(100), IN p_apellido VARCHAR(100), IN p_peso DECIMAL(5, 2), IN p_talla DECIMAL(5, 2), IN p_fecha_nacimiento DATE, IN p_EdadMeses INT, IN p_AlturaREN DECIMAL(5, 2), IN p_Sexo VARCHAR(10), IN p_Suplementacion INT, IN p_Cred INT, IN p_Tipo_EESS VARCHAR(50), IN p_Red_simple VARCHAR(100), IN p_Grupo_Edad VARCHAR(50), IN p_Suppl_x_EdadGrupo VARCHAR(50), IN p_Sexo_x_Juntos VARCHAR(50), IN p_Indice_social INT ) 
BEGIN DECLARE v_codigo_respuesta INT DEFAULT 0; 
DECLARE v_mensaje_respuesta VARCHAR(255) DEFAULT '';
DECLARE EXIT HANDLER FOR SQLEXCEPTION
BEGIN
    SET v_codigo_respuesta = 500;
    SET v_mensaje_respuesta = 'Error al registrar/actualizar paciente';
    ROLLBACK;
    SELECT v_codigo_respuesta AS codigo_respuesta, v_mensaje_respuesta AS mensaje_respuesta;
END;

START TRANSACTION;

IF p_id IS NULL THEN
    INSERT INTO registrar_paciente (
        nombre,
        apellido,
        peso,
        talla,
        fecha_nacimiento,
        EdadMeses,
        AlturaREN,
        Sexo,
        Suplementacion,
        Cred,
        Tipo_EESS,
        Red_simple,
        Grupo_Edad,
        Suppl_x_EdadGrupo,
        Sexo_x_Juntos,
        Indice_social
    ) VALUES (
        p_nombre,
        p_apellido,
        p_peso,
        p_talla,
        p_fecha_nacimiento,
        p_EdadMeses,
        p_AlturaREN,
        p_Sexo,
        p_Suplementacion,
        p_Cred,
        p_Tipo_EESS,
        p_Red_simple,
        p_Grupo_Edad,
        p_Suppl_x_EdadGrupo,
        p_Sexo_x_Juntos,
        p_Indice_social
    );
    SET v_mensaje_respuesta = 'Paciente registrado correctamente';
ELSE
    UPDATE registrar_paciente SET
        nombre = p_nombre,
        apellido = p_apellido,
        peso = p_peso,
        talla = p_talla,
        fecha_nacimiento = p_fecha_nacimiento,
        EdadMeses = p_EdadMeses,
        AlturaREN = p_AlturaREN,
        Sexo = p_Sexo,
        Suplementacion = p_Suplementacion,
        Cred = p_Cred,
        Tipo_EESS = p_Tipo_EESS,
        Red_simple = p_Red_simple,
        Grupo_Edad = p_Grupo_Edad,
        Suppl_x_EdadGrupo = p_Suppl_x_EdadGrupo,
        Sexo_x_Juntos = p_Sexo_x_Juntos,
        Indice_social = p_Indice_social
    WHERE id = p_id;
    SET v_mensaje_respuesta = 'Paciente actualizado correctamente';
END IF;

COMMIT;

SET v_codigo_respuesta = 200;

SELECT v_codigo_respuesta AS codigo_respuesta, v_mensaje_respuesta AS mensaje_respuesta;
END;
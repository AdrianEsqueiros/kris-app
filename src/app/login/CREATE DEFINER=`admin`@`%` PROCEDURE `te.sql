CREATE DEFINER=`admin`@`%` PROCEDURE `test`.`sp_registrar_paciente`(
    IN p_id INT,
    IN p_nombre VARCHAR(100),
    IN p_apellido VARCHAR(100),
    IN p_sexo ENUM('Masculino', 'Femenino', 'Otro'),
    IN p_peso DECIMAL(5, 2),
    IN p_talla DECIMAL(5, 2),
    IN p_edad INT,
    IN p_habitos_irregulares BOOLEAN,
    IN p_alimentos_ricos_hierro BOOLEAN,
    IN p_sintomas_fatiga_palidez ENUM(
        'Ninguno',
        'Fatiga',
        'Palidez',
        'Fatiga y Palidez'
    ),
    IN p_imagen LONGBLOB
)
BEGIN
    DECLARE v_codigo_respuesta INT DEFAULT 0;
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
        INSERT INTO pacientes (
            nombre,
            apellido,
            sexo,
            peso,
            talla,
            edad,
            habitos_irregulares,
            alimentos_ricos_hierro,
            sintomas_fatiga_palidez,
            imagen
        ) VALUES (
            p_nombre,
            p_apellido,
            p_sexo,
            p_peso,
            p_talla,
            p_edad,
            p_habitos_irregulares,
            p_alimentos_ricos_hierro,
            p_sintomas_fatiga_palidez,
            p_imagen
        );
        SET v_mensaje_respuesta = 'Paciente registrado correctamente';
    ELSE
        UPDATE pacientes SET
            nombre = p_nombre,
            apellido = p_apellido,
            sexo = p_sexo,
            peso = p_peso,
            talla = p_talla,
            edad = p_edad,
            habitos_irregulares = p_habitos_irregulares,
            alimentos_ricos_hierro = p_alimentos_ricos_hierro,
            sintomas_fatiga_palidez = p_sintomas_fatiga_palidez,
            imagen = p_imagen
        WHERE id = p_id;
        SET v_mensaje_respuesta = 'Paciente actualizado correctamente';
    END IF;

    COMMIT;

    SET v_codigo_respuesta = 200;

    SELECT v_codigo_respuesta AS codigo_respuesta, v_mensaje_respuesta AS mensaje_respuesta;
END
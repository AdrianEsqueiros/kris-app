export interface RegistrarPacienteRequest {
  id?: number;
  nombre: string;
  apellido: string;
  peso: number;
  talla: number;
  fecha_nacimiento: string;
  EdadMeses: number;
  AlturaREN: number;
  Sexo: number;
  Suplementacion: number;
  Cred: number;
  Tipo_EESS: string;
  Red_simple: string;
  Grupo_Edad: string;
  Suppl_x_EdadGrupo: string;
  Sexo_x_Juntos: string;
  Indice_social: number;
}

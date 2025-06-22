export interface RegistrarPacienteRequest {
  nombre: string;
  apellido: string;
  sexo: string;
  peso: number;
  talla: number;
  edad: number;
  habitos_irregulares: boolean;
  alimentos_ricos_hierro: boolean;
  sintomas_fatiga_palidez: string;
  imagen: string;
}

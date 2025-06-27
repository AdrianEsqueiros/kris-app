import axios from "axios";
import { RegistrarPacienteRequest } from "../types";

// ListarPacientes
// https://3gh2iixoag.execute-api.us-east-1.amazonaws.com/test/paciente/listar
// {
//   "filtro": "Juan",
//   "pagina": 1,
//   "tamano": 10
// }

// // RegistrarPaciente
// https://3gh2iixoag.execute-api.us-east-1.amazonaws.com/test/paciente/registrar
// {
//   "nombre": "Juan",
//   "apellido": "Pérez",
//   "sexo": "M",
//   "peso": 70.5,
//   "talla": 1.75,
//   "edad": 30,
//   "habitos_irregulares": true,
//   "alimentos_ricos_hierro": false,
//   "sintomas_fatiga_palidez": true,
//   "imagen": "base64string"
// }

const BASE_URL =
  "https://3gh2iixoag.execute-api.us-east-1.amazonaws.com/test/paciente";

export interface ListarPacientesRequest {
  filtro: string;
  pagina: number;
  tamano: number;
}

export class PacienteService {
  static async listarPacientes(data: ListarPacientesRequest) {
    const response = await axios.post(`${BASE_URL}/listar`, data);
    return response.data;
  }

  static async registrarPaciente(data: RegistrarPacienteRequest) {
    const response = await axios.post(`${BASE_URL}/registrar`, data);
    return response.data;
  }
}

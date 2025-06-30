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

const BASE_URL = "https://3gh2iixoag.execute-api.us-east-1.amazonaws.com/test";
const PY_URL = "https://healthcarekris.duckdns.org/predict";

export interface ListarPacientesRequest {
  filtro: string;
  pagina: number;
  tamano: number;
}
// Prediccion

export interface PrediccionRequest {
  EdadMeses?: number;
  AlturaREN?: number;
  Sexo?: number; // 0 para femenino, 1 para masculino
  Suplementacion?: number; // 0 o 1
  Cred?: number; // 0 o 1
  Tipo_EESS?: string; // Tipo de establecimiento de salud
  Red_simple?: string; // Red simple
  Grupo_Edad?: string; // Grupo de edad
  Suppl_x_EdadGrupo?: string; // Suplementación por grupo de edad
  Sexo_x_Juntos?: string; // Sexo por juntos
  Indice_social?: number; // Índice social
}
export interface RegistrarUsuarioRequest {
  cognito_id: string;
  nombre: string;
  apellido: string;
  correo: string;
  rol?: string;
}
export interface ListarUsuarioRequest {
  cognito_id?: string;
  filtro: string;
  pagina: number;
  tamano: number;
}

export class UsuarioService {
  static async registrarUsuario(data: RegistrarUsuarioRequest) {
    const response = await axios.post(`${BASE_URL}/usuario/registrar`, data);
    return response.data;
  }
  static async listarUsuario(data: ListarUsuarioRequest) {
    const response = await axios.post(`${BASE_URL}/usuario/listar`, data);
    return response.data;
  }
}

export class PacienteService {
  static async listarPacientes(data: ListarPacientesRequest) {
    const response = await axios.post(`${BASE_URL}/paciente/listar`, data);
    return response.data;
  }

  static async registrarPaciente(data: RegistrarPacienteRequest) {
    const response = await axios.post(`${BASE_URL}/paciente/registrar`, data);
    return response.data;
  }
  static async predecirAnemia(data: PrediccionRequest) {
    const response = await axios.post(PY_URL, data);
    return response.data;
  }
}

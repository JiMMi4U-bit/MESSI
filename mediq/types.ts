
export enum UserRole {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR'
}

export enum Language {
  EN = 'English',
  HI = 'Hindi',
  MR = 'Marathi',
  TA = 'Tamil'
}

export enum PatientStatus {
  GOOD = 'Good',
  STABLE = 'Stable',
  SERIOUS = 'Serious',
  CRITICAL = 'Critical'
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  symptoms: string;
  status: PatientStatus;
  createdAt: number;
  messages: Message[];
}

export interface MedicineInfo {
  name: string;
  uses: string[];
  sideEffects: string[];
  alternatives: string[];
  precautions: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export const PERMANENT_TEETH = {
  upperRight: [18, 17, 16, 15, 14, 13, 12, 11],
  upperLeft: [21, 22, 23, 24, 25, 26, 27, 28],
  lowerLeft: [38, 37, 36, 35, 34, 33, 32, 31],
  lowerRight: [41, 42, 43, 44, 45, 46, 47, 48],
}

export const DECIDUOUS_TEETH = {
  upperRight: [55, 54, 53, 52, 51],
  upperLeft: [61, 62, 63, 64, 65],
  lowerLeft: [75, 74, 73, 72, 71],
  lowerRight: [81, 82, 83, 84, 85],
}

export const FACE_COLORS = {
  planned: '#ef4444',   // vermelho — a fazer
  done: '#3b82f6',      // azul — feito
  existing: '#10b981',  // verde — já existia
} as const

export type FaceStatus = keyof typeof FACE_COLORS

export type ToothFace = 'vestibular' | 'lingual' | 'mesial' | 'distal' | 'occlusal'

export const TOOTH_FACES: ToothFace[] = ['vestibular', 'lingual', 'mesial', 'distal', 'occlusal']

export const FACE_LABELS: Record<ToothFace, string> = {
  vestibular: 'Vestibular',
  lingual: 'Lingual/Palatina',
  mesial: 'Mesial',
  distal: 'Distal',
  occlusal: 'Oclusal/Incisal',
}

export type ToothSymbol = 'extraction' | 'root_canal' | 'missing' | 'implant' | 'crown'

export const SYMBOL_LABELS: Record<ToothSymbol, string> = {
  extraction: 'Extração indicada',
  root_canal: 'Tratamento de canal',
  missing: 'Ausente',
  implant: 'Implante',
  crown: 'Coroa',
}

export const TOOTH_CONDITIONS = [
  { value: 'healthy', label: 'Hígido' },
  { value: 'cavity', label: 'Cárie' },
  { value: 'filled', label: 'Restaurado' },
  { value: 'crown', label: 'Coroa' },
  { value: 'missing', label: 'Ausente' },
  { value: 'implant', label: 'Implante' },
  { value: 'root_canal', label: 'Tratamento de Canal' },
  { value: 'extraction_needed', label: 'Extração Necessária' },
] as const

export function isUpperTooth(toothNumber: number): boolean {
  return (toothNumber >= 11 && toothNumber <= 28) || (toothNumber >= 51 && toothNumber <= 65)
}

export function isDeciduous(toothNumber: number): boolean {
  return toothNumber >= 51 && toothNumber <= 85
}

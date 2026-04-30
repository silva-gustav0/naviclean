// Client-safe nav configuration — no server imports

export type EffectiveRole =
  | 'clinic_owner'
  | 'doctor'
  | 'dentist'
  | 'affiliated_professional'
  | 'receptionist'

export const NAV_ROUTES_BY_ROLE: Record<string, string[]> = {
  // Administrador: tudo
  clinic_owner: [
    '/dashboard',
    '/agenda',
    '/pacientes',
    '/financeiro',
    '/equipe',
    '/tratamentos',
    '/estoque',
    '/treinamento',
    '/configuracoes',
  ],
  // Médico filiado: dashboard individual, agenda individual, pacientes, financeiro (repasse), treinamento
  doctor: ['/dashboard', '/agenda', '/pacientes', '/financeiro', '/treinamento'],
  // Dentista filiado: mesma visão do médico filiado
  dentist: ['/dashboard', '/agenda', '/pacientes', '/financeiro', '/treinamento'],
  // Dentista independente filiado: mesma visão do filiado
  affiliated_professional: ['/dashboard', '/agenda', '/pacientes', '/financeiro', '/treinamento'],
  // Recepção: dashboard, agenda geral, pacientes, financeiro, estoque, treinamento
  receptionist: [
    '/dashboard',
    '/agenda',
    '/pacientes',
    '/financeiro',
    '/estoque',
    '/treinamento',
  ],
}

export const ROLE_LABELS: Record<string, string> = {
  clinic_owner: 'Administrador',
  doctor: 'Médico',
  dentist: 'Dentista',
  affiliated_professional: 'Dentista Filiado',
  receptionist: 'Recepcionista',
}

export function isNavRouteAllowed(role: string, route: string): boolean {
  const allowed = NAV_ROUTES_BY_ROLE[role] ?? NAV_ROUTES_BY_ROLE['clinic_owner']
  return allowed.includes(route)
}

export function canManageAppointments(role: string): boolean {
  return role === 'clinic_owner' || role === 'receptionist'
}

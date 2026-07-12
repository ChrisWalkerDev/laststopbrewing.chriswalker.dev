export type AgeVerificationDecision = 'unconfirmed' | 'approved' | 'denied';

export const AGE_GATE_ROUTE = '/age-gate';
export const ACCESS_DENIED_ROUTE = '/access-denied';
export const DEFAULT_ALLOWED_ROUTE = '/';

export const AGE_GATE_DECISION_KEY = 'ageGate.decision';
export const AGE_GATE_DESTINATION_KEY = 'ageGate.requestedDestination';

export const AGE_GATE_PROMPT = 'Are you 21 or older?';

export interface RouteDecision {
  allow: boolean;
  redirectTo?: string;
}

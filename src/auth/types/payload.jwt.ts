export interface JwtPayload {
  iss?: string;
  sub?: number;
  aud?: string;
  iat?: number;
  exp?: number;
  azp?: string;
  scope?: string;
  role?: string;
}

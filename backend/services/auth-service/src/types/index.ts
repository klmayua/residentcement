export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  department: string | null;
  iat: number;
  exp: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  department: string | null;
  status: string;
  mfaEnabled: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
  mfaCode?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
  department?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface MFASecret {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  department?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  role?: string;
  department?: string;
  status?: string;
}

export interface AuditLogEntry {
  id: string;
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  errorMessage?: string;
  createdAt: Date;
}

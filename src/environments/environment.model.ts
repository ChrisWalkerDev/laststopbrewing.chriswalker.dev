/** Build-time environment configuration shape. No secrets belong here. */
export interface EnvironmentConfig {
  /** True only in production builds — controls Angular optimisations and debug guards. */
  production: boolean;
  /** Application name shown in the browser tab title. */
  appTitle: string;
}

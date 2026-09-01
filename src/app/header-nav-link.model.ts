export interface HeaderNavLink {
  label: string;
  route: '/' | '/food' | '/beer' | '/location' | '/about' | '/contact';
  exact: boolean;
}

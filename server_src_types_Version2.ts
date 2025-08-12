export type UserRole = 'admin' | 'driver' | 'dispatcher';

export type OrderStatus =
  | 'requested'
  | 'assigned'
  | 'in_transit'
  | 'notarizing'
  | 'completed'
  | 'canceled';

export type ServiceType = 'notary' | 'courier' | 'combined';

export interface JwtUser {
  id: string;
  role: UserRole;
  email: string;
  full_name?: string;
}
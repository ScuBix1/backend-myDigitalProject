export interface JwtPayload {
  id: string;
  role: string;
  username: string;
  customer_id?: string;
}

export interface Box {
  id: string;
  name: string;
  createdAt: string;
}

export interface Item {
  id: string;
  boxId: string;
  name: string;
  photoUrl: string;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

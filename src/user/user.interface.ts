export interface UserData {
  username: string;
  email: string;
  token: string;
  bio: string;
  image?: string;
}

export interface UserRO {
  user: UserData;
}

export type FindUserResponse = {
  message?: string;  // Message optionnel, utilisé si l'utilisateur n'est pas trouvé
  user: UserRO;  // L'utilisateur ou null si l'utilisateur n'est pas trouvé
};
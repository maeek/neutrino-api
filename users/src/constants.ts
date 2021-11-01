export enum MESSAGE_PATTERNS {
  GET_USER = 'GET_USER',
  CREATE_USER = 'CREATE_USER',
  REMOVE_USER = 'REMOVE_USER',
}

export const RESERVED_USERNAMES = [
  'root',
  'admin',
  'administrator',
  'server',
  'contact',
];

export enum UserType {
  ROOT = 'ROOT',
  MOD = 'MOD',
  USER = 'USER',
  GUEST = 'GUEST',
}

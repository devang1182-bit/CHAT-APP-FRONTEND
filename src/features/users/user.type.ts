export type User = {
  id: string;
  email: string | null;
  displayName?: string | null;
};

export type CurrentUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
};

export type UserState = {
  users: User[];
  selectedChatUser: User | null;
  currentUser: CurrentUser | null;
  loading: boolean;
  error: string | null;
};

type Steps = "signIn" | "totpSetup" | "confirmTotp";

export interface State {
  step: Steps;
  email: string;
  password: string;
  totpSetupURL: string;
  totpSetupSecret: string;
  isAuthenticated: boolean;
}

export type Action =
  | { type: "SET_EMAIL"; payload: { email: string } }
  | { type: "SET_IS_AUTHENTICATED"; payload: { isAuthenticated: boolean } }
  | { type: "SET_PASSWORD"; payload: { password: string } }
  | { type: "SET_TOTP_SETUP"; payload: { URL: string; secret: string } }
  | { type: "SET_STEP"; payload: { step: Steps } }
  | { type: "CLEAR_FILTERS" };

export interface Context {
  filterState: State;
  dispatchFilter: React.Dispatch<Action>;
}

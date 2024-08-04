"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { Action, State } from "@/contexts/login/types";

const initialState: State = {
  step: "signIn",
  email: "",
  password: "",
  totpSetupURL: "",
  totpSetupSecret: "",
  isAuthenticated: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_EMAIL":
      return { ...state, email: action.payload.email };
    case "SET_IS_AUTHENTICATED":
      return { ...state, isAuthenticated: action.payload.isAuthenticated };
    case "SET_PASSWORD":
      return { ...state, password: action.payload.password };
    case "SET_STEP":
      return { ...state, step: action.payload.step };
    case "SET_TOTP_SETUP":
      return {
        ...state,
        totpSetupURL: action.payload.URL,
        totpSetupSecret: action.payload.secret,
        step: "totpSetup",
      };
    case "CLEAR_FILTERS":
      return initialState;
    default:
      return state;
  }
}

export interface Context {
  filterState: State;
  dispatchFilter: React.Dispatch<Action>;
  cancel: React.RefObject<boolean | null>;
  toastId: React.RefObject<string | number | null>;
  intervalId: React.RefObject<NodeJS.Timeout | null>;
  promiseResolve: React.RefObject<(() => void) | null>;
}

export const LoginContext = createContext<Context>({
  filterState: initialState,
  dispatchFilter: () => null,
  cancel: { current: null },
  toastId: { current: null },
  intervalId: { current: null },
  promiseResolve: { current: null },
});

interface LoginProviderProps {
  children: ReactNode;
}

export function LoginProvider({ children }: LoginProviderProps) {
  const cancel = useRef<boolean>(null);
  const toastId = useRef<string | number>(null);
  const intervalId = useRef<NodeJS.Timeout>(null);
  const promiseResolve = useRef<() => void>(null);
  const [filterState, dispatchFilter] = useReducer(reducer, initialState);

  const value = useMemo(
    () => ({
      filterState,
      dispatchFilter,
      cancel,
      toastId,
      intervalId,
      promiseResolve,
    }),
    [filterState, dispatchFilter],
  );

  return <LoginContext value={value}>{children}</LoginContext>;
}

export function useLogin() {
  const context = useContext(LoginContext);
  if (!context) {
    throw new Error("LoginContext must be used within LoginProvider");
  }
  return context;
}

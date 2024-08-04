"use client";
import { useLogin } from "@/contexts/login";
import { TextField } from "@/design-system/text-field";
import Link from "next/link";
import { useState } from "react";
import * as Svg from "../app/svgs";
import { OTPInput, SlotProps } from "input-otp";
import { cn } from "@/utils/tailwind";
import { toast } from "sonner";

const EMAIL = "Dark";
const PASSWORD = "w#h.c@D.93PBfVP";

function SignIn() {
  const {
    filterState,
    dispatchFilter,
    cancel,
    toastId,
    intervalId,
    promiseResolve,
  } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin() {
    dispatchFilter({ type: "SET_STEP", payload: { step: "confirmTotp" } });

    const promise = () =>
      new Promise<void>(async (resolve, reject) => {
        await new Promise<void>((resolve) => {
          promiseResolve.current = resolve;
          intervalId.current = setTimeout(resolve, 2000);
        });

        if (cancel.current) {
          cancel.current = false;
          return;
        }

        if (filterState.email === EMAIL && filterState.password === PASSWORD) {
          dispatchFilter({
            type: "SET_IS_AUTHENTICATED",
            payload: { isAuthenticated: true },
          });
          resolve();
        } else {
          dispatchFilter({ type: "SET_STEP", payload: { step: "signIn" } });
          reject(new Error("Email ou senha incorretos."));
        }
      }).finally(() => (toastId.current = null));

    toastId.current = toast.promise(promise, {
      loading: "Autenticando...",
      success: "Autenticação realizada com sucesso!",
      error: (data) => data.message,
    });
  }

  return (
    <>
      <h1 className="mb-14 text-center text-[22px]/none font-medium text-[#212121]">
        Acesse sua conta
      </h1>

      <TextField.Group className="mb-8">
        <TextField.Label htmlFor="email">Email</TextField.Label>
        <TextField.Input
          id="email"
          value={filterState.email}
          onChange={(event) =>
            dispatchFilter({
              type: "SET_EMAIL",
              payload: { email: event.target.value },
            })
          }
          placeholder="Digite seu email"
          spellCheck="false"
          type="email"
        />
      </TextField.Group>

      <TextField.Group className="mb-10">
        <div className="flex justify-between">
          <TextField.Label htmlFor="password">Senha</TextField.Label>
          <Link
            href="#"
            className="text-sm/none text-[#808080] underline-offset-3 hover:underline"
          >
            Esqueci minha senha
          </Link>
        </div>
        <TextField.Root>
          <TextField.Input
            id="password"
            value={filterState.password}
            onChange={(event) =>
              dispatchFilter({
                type: "SET_PASSWORD",
                payload: { password: event.target.value },
              })
            }
            type={showPassword ? "text" : "password"}
            placeholder="Digite sua senha"
          />
          <TextField.Icon
            aria-label={`${showPassword ? "Ocultar" : "Mostrar"} senha`}
            onClick={() => setShowPassword((oldValue) => !oldValue)}
          >
            {showPassword ? <Svg.Eye /> : <Svg.EyeSlash />}
          </TextField.Icon>
        </TextField.Root>
      </TextField.Group>

      <button
        onClick={handleLogin}
        className="mb-16 w-full cursor-pointer rounded-[5px] bg-[#0047F6] py-3 px-6 text-base/normal font-medium text-white shadow-[0_4px_8px] shadow-[#0047F6]/20 transition hover:bg-[#0031AA] disabled:opacity-33"
      >
        Entrar
      </button>

      <span className="block text-balance text-center text-sm/normal text-[#808080]">
        Ao criar uma conta você concorda com nossos{" "}
        <Link
          href="#"
          className="text-[#3874FA] underline underline-offset-3 transition-[color] hover:text-[#0044DD]"
        >
          Termos de Serviços
        </Link>{" "}
        e nossa{" "}
        <Link
          href="#"
          className="text-[#3874FA] underline underline-offset-3 transition-[color] hover:text-[#0044DD]"
        >
          Política de Privacidade
        </Link>
      </span>
    </>
  );
}

function FakeCaret() {
  return (
    <div className="animate-caret-blink pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="h-5 w-0.5 bg-black" />
    </div>
  );
}

function Slot(props: SlotProps) {
  return (
    <div
      className={cn(
        "relative size-12 font-medium text-black",
        "flex items-center justify-center",
        "transition-all",
        "rounded-[5px] shadow-[0_4px_8px_#ccc3]",
        props.isActive
          ? "inset-shadow-[0_0_0_1.5px_#000000]"
          : "inset-shadow-[0_0_0_1px_#D9D9D9] group-focus-within:inset-shadow-[#afafaf] group-hover:inset-shadow-[#afafaf]",
        props.char === null &&
          !props.hasFakeCaret &&
          "text-[#D9D9D9] transition-none",
      )}
    >
      {props.char === null && !props.hasFakeCaret && <div>0</div>}
      {props.char !== null && <div>{props.char}</div>}
      {props.hasFakeCaret && <FakeCaret />}
    </div>
  );
}

function ConfirmTotp() {
  const {
    filterState,
    dispatchFilter,
    cancel,
    toastId,
    intervalId,
    promiseResolve,
  } = useLogin();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin() {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    dispatchFilter({ type: "SET_STEP", payload: { step: "confirmTotp" } });
    setIsLoading(false);
  }

  function goBack() {
    if (
      !cancel.current &&
      toastId.current &&
      intervalId.current &&
      promiseResolve.current
    ) {
      clearInterval(intervalId.current);
      cancel.current = true;
      promiseResolve.current();
      toast.warning("Autenticação cancelada!", {
        id: toastId.current,
        classNames: {
          icon: "mt-px",
        },
      });
    }
    dispatchFilter({
      type: "SET_IS_AUTHENTICATED",
      payload: { isAuthenticated: false },
    });
    dispatchFilter({ type: "SET_STEP", payload: { step: "signIn" } });
  }

  return (
    <>
      <h1 className="mb-6 text-center text-[22px]/none font-medium text-[#212121]">
        Digite o código de verificação
      </h1>

      <h3 className="mb-10 text-balance text-center text-[#4B4B4B]">
        Insira o código de verificação gerado pelo seu aplicativo autenticador
      </h3>

      <OTPInput
        maxLength={6}
        containerClassName="group mb-12 flex items-center justify-center has-[:disabled]:opacity-30"
        render={({ slots }) => (
          <div className="flex gap-3">
            {slots.map((slot, idx) => (
              <Slot key={idx} {...slot} />
            ))}
          </div>
        )}
      />

      <div className="mb-16 flex gap-4">
        <button
          onClick={goBack}
          className="w-full cursor-pointer rounded-[5px] py-3 px-6 text-base/normal font-medium text-[#545454] inset-shadow-[0_0_0_1px_#D9D9D9] shadow-[0_4px_8px] shadow-[#CCCCCC]/20 transition hover:bg-black/2.5 hover:inset-shadow-[#c9c9c9]"
        >
          Voltar
        </button>
        <button
          onClick={handleLogin}
          disabled={!filterState.isAuthenticated || isLoading}
          className="w-full cursor-pointer rounded-[5px] bg-[#0047F6] py-3 px-6 text-base/normal font-medium text-white shadow-[0_4px_8px] shadow-[#0047F6]/20 transition not-disabled:hover:bg-[#0031AA] disabled:cursor-not-allowed disabled:opacity-33"
        >
          Confirmar
        </button>
      </div>

      <span className="block text-balance text-center text-sm/normal text-[#808080]">
        Não consegue acessar seu aplicativo de autenticação?{" "}
        <Link
          href="#"
          className="text-[#3874FA] underline underline-offset-3 transition-[color] hover:text-[#0044DD]"
        >
          Contate o suporte
        </Link>
      </span>
    </>
  );
}

export function Login() {
  const { filterState } = useLogin();

  const steps: Record<typeof filterState.step, React.ReactNode> = {
    signIn: <SignIn />,
    totpSetup: <div />,
    confirmTotp: <ConfirmTotp />,
  };

  return <div className="w-full px-[88px]">{steps[filterState.step]}</div>;
}

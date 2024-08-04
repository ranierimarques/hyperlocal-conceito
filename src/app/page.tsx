import * as Svg from "./svgs";

import { LoginProvider } from "@/contexts/login";
import { Login } from "@/components/login";

export default function Home() {
  return (
    <main className="flex h-full items-center">
      <div className="h-full flex-1 bg-[linear-gradient(323.43deg,#0B1551_0%,#070E36_91.69%)]">
        <div className="relative flex h-full items-center justify-center bg-[url('./texture.png')] bg-contain">
          <Svg.HyperlocalLogoWhite className="absolute top-12 left-12" />
          <Svg.Dots className="absolute top-[17px] -right-20" />
          <Svg.Dots className="absolute bottom-[27px] -left-[136px]" />
          <div className="absolute top-10 -right-[240px] h-[347px] w-[539px] bg-[radial-gradient(42.23%_42.23%_at_50%_50%,_rgba(73,107,195,0.08)_0%,_rgba(8,16,62,0.08)_100%)]" />
          <div className="absolute bottom-10 -left-[300px] h-[347px] w-[539px] bg-[radial-gradient(42.23%_42.23%_at_50%_50%,_rgba(73,107,195,0.08)_0%,_rgba(8,16,62,0.08)_100%)]" />
          <div className="absolute -top-20 -left-[187px] h-[347px] w-[539px] bg-[radial-gradient(42.23%_42.23%_at_50%_50%,_rgba(73,107,195,0.08)_0%,_rgba(8,16,62,0.08)_100%)]" />

          <div className="relative mb-8 text-center">
            <div className="absolute -top-[73px] -left-[62px] h-[347px] w-[539px] bg-[radial-gradient(42.23%_42.23%_at_50%_50%,_rgba(73,107,195,0.05)_0%,_rgba(8,16,62,0.05)_100%)]" />

            <Svg.HyperlocalIllustration className="mr-4 mb-16" />

            <h2 className="mb-6 text-xl/tight text-white">
              Tudo que você precisa em um banco
            </h2>
            <h3 className="font-light text-[#CCE1FF]">
              Faça pagamentos, transferências, agendamentos, <br /> pix,
              gerencie suas cobranças e seus cartões.
            </h3>
          </div>

          <div className="absolute bottom-24 flex gap-4 opacity-50">
            <div className="flex items-center gap-4">
              <Svg.HyperlocalMinimalist />
              <div className="h-full w-px rounded-full bg-[#CCE1FF] py-0.5" />
            </div>
            <div className="flex gap-8">
              <Svg.Avec />
              <Svg.CrossX />
              <Svg.HyperlocalFranchises />
              <Svg.Hyperlocal />
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex h-full w-[576px] flex-col items-center justify-center border-l border-[#F2F2F2] bg-white shadow-[0_4px_15px_rgba(0,0,0,0.6)]">
        <Svg.HyperlocalLogoColorful className="absolute top-16" />

        <LoginProvider>
          <Login />
        </LoginProvider>

        <span className="absolute bottom-10 block text-[13px]/[20px] tracking-[-0.2px] text-[#A6A6A6]">
          © 2024 Hyperlocal <span className="text-[#BFBFBF]">•</span> Todos os
          direitos reservados
        </span>
      </div>
    </main>
  );
}

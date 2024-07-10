"use client";

import { useState } from "react";
import * as Svg from "./svgs";
import { TextField } from "@/design-system/text-field";

export default function Home() {
  const [value, setValue] = useState("");

  function handleToggleVisibility() {
    console.log("toggle");
  }

  return (
    <main className="flex h-full items-center text-white">
      <div className="h-full flex-1 bg-[linear-gradient(323.43deg,#0B1551_0%,#070E36_91.69%)]">
        A
      </div>
      <div className="flex h-full w-[576px] flex-col items-center border border-[#F2F2F2] shadow-[0_4px_15px_rgba(0,0,0,0.6)]">
        <Svg.HyperlocalLogoColorful />

        <div>
          <h1 className="text-[22px]/none font-semibold text-[#212121]">
            Acesse sua conta
          </h1>

          <TextField.Group>
            <TextField.Label htmlFor="email">Email</TextField.Label>
            <TextField.Root>
              <TextField.Input
                value={value}
                onChange={(event) => setValue(event.target.value)}
              />
              <TextField.Icon>
                <Svg.Eye />
              </TextField.Icon>
            </TextField.Root>
          </TextField.Group>

          <TextField.Group>
            <TextField.Label htmlFor="email">Email</TextField.Label>
            <TextField.Input
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
          </TextField.Group>
        </div>

        <span className="block text-[13px]/[20px] tracking-[-0.2px] text-[#A6A6A6]">
          © 2024 Hyperlocal <span className="text-[#BFBFBF]">•</span> Todos os
          direitos reservados
        </span>
      </div>
    </main>
  );
}

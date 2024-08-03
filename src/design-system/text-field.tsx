import * as RadixLabel from "@radix-ui/react-label";
import { createContext, useContext } from "react";
import { twMerge } from "tailwind-merge";
import { Slot } from "@radix-ui/react-slot";

const Context = createContext<0 | 1>(0);

/*
|-----------------------------------------------------------------------------
| Group
|-----------------------------------------------------------------------------
*/

type GroupProps = React.ComponentProps<"div"> & {
  children: React.ReactNode;
};

function Group({ className, ...props }: GroupProps) {
  return (
    <div
      className={twMerge("group flex flex-col gap-2", className)}
      {...props}
    />
  );
}

/*
|-----------------------------------------------------------------------------
| Label
|-----------------------------------------------------------------------------
*/

type LabelProps = React.ComponentProps<typeof RadixLabel.Root> & {
  htmlFor: string;
  children: React.ReactNode;
};

function Label({ className, ...props }: LabelProps) {
  return (
    <RadixLabel.Root
      className={twMerge(
        "block w-fit text-base/none font-medium tracking-[0.4px] text-[#404040]",
        "group-has-disabled:opacity-30",
        className,
      )}
      {...props}
    />
  );
}

/*
|-----------------------------------------------------------------------------
| Root
|-----------------------------------------------------------------------------
*/

type RootProps = React.ComponentProps<"div"> & {
  children: React.ReactNode;
};

function Root({ className, children, ...props }: RootProps) {
  return (
    <div
      className={twMerge(
        "flex cursor-text items-center rounded-[5px] inset-ring shadow-[0_4px_8px_#ccc3] inset-ring-[#D9D9D9] outline-2 outline-offset-2",
        "has-data-[status=success]:shadow-green-100",
        "has-data-[status=error]:shadow-red-100",
        "has-[.ds-input:focus]:inset-ring-[#afafaf]",
        "has-autofill:bg-[#F7F9FE]",
        "has-disabled:cursor-not-allowed has-disabled:bg-[#c7c7c7] has-disabled:shadow-none",
        className,
      )}
      onPointerDown={(event) => {
        const target = event.target as HTMLElement;
        if (target.closest("input, button, a")) return;

        const input =
          event.currentTarget.querySelector<HTMLInputElement>(".ds-input");
        if (!input) return;

        if (input.type === "date") {
          input.showPicker();
          return;
        }

        const position = input.compareDocumentPosition(target);
        const targetIsBeforeInput =
          (position & Node.DOCUMENT_POSITION_PRECEDING) !== 0;
        const cursorPosition = targetIsBeforeInput ? 0 : input.value.length;

        requestAnimationFrame(() => {
          // Only some input types support this, browsers will throw an error if not supported
          // See: https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setSelectionRange#:~:text=Note%20that%20according,not%20support%20selection%22.
          try {
            input.setSelectionRange(cursorPosition, cursorPosition);
          } catch (e) {}
          input.focus();
        });
      }}
      onTouchEnd={(event) => {
        const target = event.target as HTMLElement;
        if (target.closest("input, button, a")) return;

        event.preventDefault();
      }}
      {...props}
    >
      <Context value={1}>{children}</Context>
    </div>
  );
}

/*
|-----------------------------------------------------------------------------
| Input
|-----------------------------------------------------------------------------
*/

type InputProps = React.ComponentProps<"input"> & {
  status?: "error" | "success";
};

function Input({ disabled, status, className, type, ...props }: InputProps) {
  const context = useContext(Context);
  const onlyInput = context === 0;

  return (
    <input
      data-status={disabled ? undefined : status}
      disabled={disabled}
      type={type}
      className={twMerge(
        "ds-input",
        "w-full border-none bg-transparent py-3 text-base/normal text-[#161616] caret-[#0047F6] outline-none",
        "first:pl-4 last:pr-4",
        "placeholder:text-[#808080]",
        "autofill:bg-clip-text",
        "disabled:cursor-not-allowed",
        type === "date" && "h-12 [&::-webkit-calendar-picker-indicator]:hidden",
        onlyInput && [
          "rounded-[5px] px-4 inset-shadow-[0_0_0_1px_#D9D9D9] shadow-[0_4px_8px_#ccc3]",
          "autofill:inset-ring-[2rem] autofill:inset-ring-[#F7F9FE]",
          "focus:inset-shadow-[#afafaf]",
        ],
        className,
      )}
      {...props}
    />
  );
}

/*
|-----------------------------------------------------------------------------
| Icon
|-----------------------------------------------------------------------------
*/

type IconProps = React.ComponentProps<"div"> & {
  children: React.ReactNode;
};

function Icon({ className, onClick, ...props }: IconProps) {
  const Component = (onClick ? "button" : Slot) as React.ElementType;
  const buttonProps = onClick && { type: "button", onClick };

  return (
    <Component
      className={twMerge(
        "shrink-0 py-3 px-4 text-[#808080]",
        "first:pr-2.5 last:pl-2.5",
        onClick ? "cursor-pointer" : "box-content",
        className,
      )}
      {...buttonProps}
      {...props}
    />
  );
}

/*
|-----------------------------------------------------------------------------
| Helper
|-----------------------------------------------------------------------------
*/

type HelperProps = React.ComponentProps<"span"> & {
  children: React.ReactNode;
};

function Helper({ className, ...props }: HelperProps) {
  return (
    <span
      className={twMerge(
        "mt-2 block text-black",
        "group-has-data-[status=success]:text-green-400",
        "group-has-data-[status=error]:text-red-400",
        "empty:mt-auto",
        className,
      )}
      {...props}
    />
  );
}

// Exports

export const TextField = {
  Group,
  Label,
  Root,
  Input,
  Icon,
  Helper,
};

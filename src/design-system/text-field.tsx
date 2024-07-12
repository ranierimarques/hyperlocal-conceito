import * as RadixLabel from "@radix-ui/react-label";
import { createContext, useContext } from "react";
import { twMerge } from "tailwind-merge";
import { Slot } from "@radix-ui/react-slot";

const Context = createContext<boolean>(false);

/*
|-----------------------------------------------------------------------------
| Group
|-----------------------------------------------------------------------------
*/

type GroupProps = React.ComponentProps<"div"> & {
  children: React.ReactNode;
};

function Group({ className, ...props }: GroupProps) {
  return <div className={twMerge("group", className)} {...props} />;
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
        "mb-2 block w-fit text-base/none font-medium tracking-[0.4px] text-[#404040]",
        "group-has-disabled:opacity-30",
        "group-has-focus:text-[#0047F6]",
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
        "flex cursor-text items-center rounded ring ring-blue-400",
        "has-data-[status=success]:shadow-green-100",
        "has-data-[status=error]:shadow-red-100",
        "has-focus:bg-blue-100",
        "has-autofill:bg-[#c7c7c7]",
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
      <Context value={true}>{children}</Context>
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
  const hasRoot = context !== false;

  return (
    <input
      data-status={disabled ? undefined : status}
      disabled={disabled}
      type={type}
      className={twMerge(
        "ds-input",
        "w-full bg-transparent py-3 text-[#161616] outline-none",
        "first:pl-4 last:pr-4 only:px-4",
        "placeholder:text-neutral-dark",
        "autofill:bg-clip-text",
        "disabled:cursor-not-allowed",
        type === "date" && "h-12 [&::-webkit-calendar-picker-indicator]:hidden",
        hasRoot ? "a" : "b",
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
        "py-3 px-4 text-[#808080]",
        "first:pr-2.5 last:pl-2.5",
        !onClick && "box-content",
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

import * as RadixLabel from "@radix-ui/react-label";
import { createContext, forwardRef, useContext } from "react";
import { twMerge } from "tailwind-merge";
import { Slot } from "@radix-ui/react-slot";

const Context = createContext<boolean>(false);

/*
|-----------------------------------------------------------------------------
| Group
|-----------------------------------------------------------------------------
*/

const Group = forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & {
    children: React.ReactNode;
  }
>(function Group({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={twMerge("flex flex-col gap-2", className)}
      {...props}
    />
  );
});

/*
|-----------------------------------------------------------------------------
| Label
|-----------------------------------------------------------------------------
*/

const Label = forwardRef<
  React.ElementRef<typeof RadixLabel.Root>,
  React.ComponentProps<typeof RadixLabel.Root> & {
    htmlFor: string;
    children: React.ReactNode;
  }
>(function Label({ className, ...props }, ref) {
  return (
    <RadixLabel.Root
      ref={ref}
      className={twMerge(
        "mb-2 block w-fit text-xs/none font-medium text-[#404040] has-[+_.TextFieldRoot_:focus]:text-[#0047F6] has-[+_.TextFieldRoot_:disabled]:opacity-30",
        className,
      )}
      {...props}
    />
  );
});

/*
|-----------------------------------------------------------------------------
| Root
|-----------------------------------------------------------------------------
*/

const Root = forwardRef<
  React.ElementRef<"div">,
  {
    children: React.ReactNode;
    className?: string;
    variant?: "blue" | "red";
  } & {
    [key: string]: unknown;
  }
>(function Root({ className, children, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={twMerge(
        "TextFieldRoot rounded-xs shadow-neutral-main has-[:autofill]:bg-neutral-lighter has-[:disabled]:bg-neutral-lighter has-[:focus]:shadow-primary-main has-[[data-status=error]]:shadow-status-error-default has-[[data-status=success]]:shadow-status-success-default peer flex cursor-text items-center shadow-[0_0_0_1px] has-[:disabled]:cursor-not-allowed has-[:disabled]:shadow-[none]",
        className,
      )}
      onPointerDown={(event) => {
        const target = event.target as HTMLElement;
        if (target.closest("input, button, a")) return;

        const input =
          event.currentTarget.querySelector<HTMLInputElement>(
            ".TextFieldInput",
          );
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
      <Context.Provider value={true}>{children}</Context.Provider>
    </div>
  );
});

/*
|-----------------------------------------------------------------------------
| Input
|-----------------------------------------------------------------------------
*/

const Input = forwardRef<
  React.ElementRef<"input">,
  React.ComponentPropsWithoutRef<"input"> & {
    status?: "error" | "success";
  }
>(function Input({ disabled, status, className, type, ...props }, ref) {
  const context = useContext(Context);
  const hasRoot = context !== false;

  return (
    <input
      ref={ref}
      data-status={disabled ? undefined : status}
      disabled={disabled}
      type={type}
      className={twMerge(
        "TextFieldInput py-inset-xs text-neutral-darkest placeholder:text-neutral-dark first:pl-inset-md last:pr-inset-md only:px-inset-md w-full bg-[transparent] outline-none autofill:bg-clip-text disabled:cursor-not-allowed",
        type === "date" && "h-12 [&::-webkit-calendar-picker-indicator]:hidden",
        hasRoot ? "bg-blue-500" : "bg-red-500",
        className,
      )}
      {...props}
    />
  );
});

/*
|-----------------------------------------------------------------------------
| Icon
|-----------------------------------------------------------------------------
*/

const Icon = forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & {
    children: React.ReactNode;
  }
>(function Icon({ className, onClick, ...props }, ref) {
  const Component = (onClick ? "button" : Slot) as React.ElementType;

  return (
    <Component
      ref={ref}
      onClick={onClick}
      className={twMerge(
        "px-4 py-3 text-[#808080] first:pr-2.5 last:pl-2.5",
        !onClick && "box-content",
        className,
      )}
      {...(onClick && { type: "button" })}
      {...props}
    />
  );
});

/*
|-----------------------------------------------------------------------------
| Helper
|-----------------------------------------------------------------------------
*/

const Helper = forwardRef<
  React.ElementRef<"span">,
  React.ComponentPropsWithoutRef<"span"> & {
    children: React.ReactNode;
  }
>(function Helper({ className, ...props }, ref) {
  return (
    <span
      ref={ref}
      className={twMerge(
        ".TextFieldHelper mt-inset-x2s font-base text-x2s/md font-regular text-neutral-dark peer-has-[[data-status=error]]:text-status-error-default peer-has-[[data-status=success]]:text-status-success-default block empty:mt-auto",
        className,
      )}
      {...props}
    />
  );
});

// Exports

export const TextField = {
  Group,
  Label,
  Root,
  Input,
  Icon,
  Helper,
};

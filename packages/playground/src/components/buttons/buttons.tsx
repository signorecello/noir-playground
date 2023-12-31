import React, { FormEvent, ReactNode } from "react";

export const Button = ({
  type = "button",
  className,
  disabled,
  $primary,
  onClick,
  children,
  ...props
}: {
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
  $primary?: boolean;
  onClick?: (e: FormEvent) => void;
  children?: React.ReactNode;
}) => {
  const buttonClasses = `${className} px-6 px-3 m-2 rounded-md max-w-xs ${
    $primary ? "bg-purple-1" : "bg-pink-2"
  } max-h-10 text-right text-base normal-case font-medium leading-none flex p-5 justify-center items-center ${
    disabled ? "opacity-50" : "opacity-100"
  } w-full text-gray-7`;

  return (
    <button
      onClick={onClick}
      type={type}
      className={buttonClasses}
      tabIndex={-1}
      {...props}
    >
      {children}
    </button>
  );
};

export const BackButton = ({
  children,
  $primary,
  onClick,
}: {
  children?: ReactNode;
  $primary?: boolean;
  onClick?: (e: FormEvent) => void;
}) => (
  <Button onClick={onClick} $primary={$primary} className="bg-[#b31312]">
    {children}
  </Button>
);

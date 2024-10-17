import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

type ComponentType = "button" | "input" | "select";

type ComponentProps<T extends ComponentType> = T extends "button"
  ? ButtonProps
  : T extends "input"
  ? InputProps
  : SelectProps;

const components = {
  button: (props: ButtonProps) => (
    <button
      {...props}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    />
  ),
  input: (props: InputProps) => (
    <input
      {...props}
      className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  ),
  select: (props: SelectProps) => (
    <select
      {...props}
      className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  ),
};

export const createComponent = <T extends ComponentType>(
  type: T,
  props: ComponentProps<T>
): JSX.Element => {
  const Component = components[type] as (
    props: ComponentProps<T>
  ) => JSX.Element;
  return Component(props);
};

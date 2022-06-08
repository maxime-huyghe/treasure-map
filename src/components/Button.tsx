import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

const buttonClasses = (disabled: boolean) => {
  const enabledColor = "bg-blue-600";
  const disabledColor = "bg-blue-200";
  return `${ disabled ? disabledColor : enabledColor } border-2 text-white p-2 rounded-md`;
};

const Button = (props: ButtonHTMLAttributes<HTMLElement>) => {
  return <button {...props} className={`${ props.className } ${ buttonClasses(props.disabled || false) }`} />;
};

Button.AsLink = (props: AnchorHTMLAttributes<HTMLElement>) => {
  return <a {...props} className={`${ props.className } ${ buttonClasses(false) }`} />;
};

export default Button;

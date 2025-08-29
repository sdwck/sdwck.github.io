import React from "react";

type LinkButtonProps = {
  href?: string;
  label: string;
  onClick?: () => void;
  icon?: React.ComponentType<{ size?: number }> | null;
};

export function LinkButton({ href, label, onClick, icon: Icon }: LinkButtonProps) {
  const isDisabled = (!href || href === "#") && !onClick;
  const content = (
    <div
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
        isDisabled ? "opacity-60 cursor-not-allowed border-transparent" : "hover:-translate-y-0.5 hover:shadow-lg border-black/10 dark:border-white/10 cursor-pointer"
      }`}
    >
      {Icon ? <Icon size={16} /> : null}
      <span>{label}</span>
    </div>
  );
  if (onClick) {
    return isDisabled ? <div>{content}</div> : <button onClick={onClick}>{content}</button>;
  }
  return isDisabled ? <div>{content}</div> : <a href={href} target="_blank" rel="noopener noreferrer">{content}</a>;
}
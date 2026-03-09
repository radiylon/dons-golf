import type { ReactNode } from "react";

export default function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: ReactNode;
}) {
  return (
    <header className="bg-usf-green px-4 pt-12 pb-5 mb-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3">
          <img
            src="/usf-logo.svg"
            alt="USF Dons"
            className="w-9 h-9 object-contain"
          />
          <div>
            <h1 className="text-white text-xl font-bold">{title}</h1>
            {subtitle && (
              <p className="text-usf-gold text-sm font-medium mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

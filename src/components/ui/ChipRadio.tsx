"use client";

interface ChipRadioProps {
  name: string;
  options: readonly string[] | readonly { value: string; label: string }[];
  value: string;
  onChange: (next: string) => void;
  legend: string;
  required?: boolean;
}

export function ChipRadio({ name, options, value, onChange, legend, required }: ChipRadioProps) {
  const items = options.map(o =>
    typeof o === "string" ? { value: o, label: o } : o
  );
  return (
    <fieldset>
      <legend className="kx-label">
        {legend}
        {required && <span aria-hidden="true" className="text-khi-blue-bright"> *</span>}
      </legend>
      <div role="radiogroup" aria-required={required} className="flex flex-wrap gap-2">
        {items.map(opt => {
          const checked = value === opt.value;
          return (
            <label
              key={opt.value}
              className={`cursor-pointer rounded-full px-4 py-2.5 text-xs transition-colors duration-200 ease-soft border ${
                checked
                  ? "bg-khi-blue/15 border-khi-blue/55 text-khi-blue-soft"
                  : "bg-white/[0.04] border-white/10 text-white/70 hover:border-khi-blue/30"
              } focus-within:ring-2 focus-within:ring-khi-blue-bright focus-within:ring-offset-2 focus-within:ring-offset-khi-ink`}
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={checked}
                onChange={() => onChange(opt.value)}
                className="sr-only"
                required={required}
              />
              {opt.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

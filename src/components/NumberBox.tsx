"use client";

export default function NumberBox({
  label,
  value,
  onChange,
  disabled,
  w = "w-14",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
  w?: string;
}) {
  return (
    <input
      type="number"
      aria-label={label}
      value={Number.isFinite(value) ? value : ""}
      disabled={disabled}
      onChange={(e) => {
        const raw = e.target.value;
        if (raw === "" || raw === "-") {
          onChange(0);
          return;
        }
        const v = parseInt(raw, 10);
        onChange(Number.isNaN(v) ? 0 : v);
      }}
      className={`${w} rounded-lg border border-brand-line bg-brand-bg px-2 py-1.5 text-center font-mono text-lg text-brand-ink outline-none focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/40 disabled:opacity-60`}
    />
  );
}

import { Search, X } from "lucide-react";

type DashboardSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function DashboardSearch({ value, onChange }: DashboardSearchProps) {
  return (
    <div className="mb-7 mt-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white" size={14} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Mavzular boʻyicha qidirish.."
          className="w-full rounded-xl border border-white/60
            pl-9 pr-9 py-2.5 text-sm  text-slate-300 placeholder:text-white/70 outline-none transition
            focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-slate-300"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
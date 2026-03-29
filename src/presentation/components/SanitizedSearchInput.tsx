import { Search } from "lucide-react";
import { Input } from "@/presentation/components/ui/input";
import { useSanitizedForm } from "@/app/hooks/useSanitizedForm";

interface SanitizedSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
}

export function SanitizedSearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  ariaLabel = "Search",
}: SanitizedSearchInputProps) {
  const { sanitizeValues } = useSanitizedForm<{ query: string }>({
    query: "search",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeValues({ query: e.target.value });
    onChange(sanitized.query);
  };

  return (
    <div className={className}>
      <div className="relative max-w-md">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
          aria-hidden="true"
        />
        <Input
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className="pl-10 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
          aria-label={ariaLabel}
        />
      </div>
    </div>
  );
}

export default SanitizedSearchInput;
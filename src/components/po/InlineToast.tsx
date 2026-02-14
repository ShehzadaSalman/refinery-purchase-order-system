"use client";

type InlineToastProps = {
  message: string;
  onClose: () => void;
  variant?: "success" | "error";
};

export function InlineToast({
  message,
  onClose,
  variant = "success",
}: InlineToastProps) {
  const isError = variant === "error";

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 animate-[toast-in_180ms_ease-out] rounded-lg border px-4 py-3 text-sm shadow-lg ${
        isError
          ? "border-red-200 bg-red-50 text-red-900"
          : "border-emerald-200 bg-emerald-50 text-emerald-900"
      }`}
    >
      <div className="flex items-center gap-3">
        <p className="font-medium">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className={`rounded px-2 py-1 text-xs ${
            isError ? "border border-red-300" : "border border-emerald-300"
          }`}
        >
          Close
        </button>
      </div>
    </div>
  );
}

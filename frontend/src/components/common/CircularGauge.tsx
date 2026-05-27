export default function CircularGauge({ value, max = 100, label = 'Risk', size = 192 }: { value: number; max?: number; label?: string; size?: number }) {
  const pct = Math.min(value / max, 1);
  const circumference = 2 * Math.PI * 42;
  const offset = circumference * (1 - pct);

  return (
    <div className="relative w-48 h-48 flex-shrink-0" style={{ width: size, height: size }}>
      <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" fill="none" r="42" stroke="#e2e2e2" strokeWidth="8" />
        <circle
          cx="50" cy="50" fill="none" r="42"
          stroke="#C51C39" strokeDasharray={circumference}
          strokeDashoffset={offset} strokeLinecap="round" strokeWidth="8"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-display-lg text-display-lg text-on-background leading-none">
          {value}<span className="font-headline-md text-headline-md">%</span>
        </span>
        <span className="font-label-lg text-label-lg text-carmine-red uppercase mt-1">{label}</span>
      </div>
    </div>
  );
}

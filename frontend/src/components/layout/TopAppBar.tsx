interface TopAppBarProps {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
}

export default function TopAppBar({
  title = 'Flight Analytics',
  subtitle,
  showSearch = false,
  searchPlaceholder = 'Search parameters...',
}: TopAppBarProps) {
  return (
    <header className="sticky top-0 w-full z-40 bg-surface-container-lowest border-b border-surface-variant shadow-sm flex items-center justify-between px-margin-desktop h-16 overflow-hidden">
      <div className="flex items-center gap-6">
        <button className="md:hidden text-on-surface">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="font-title-lg text-title-lg font-bold text-on-background">{title}</div>
        {subtitle && <span className="font-body-md text-secondary ml-2">{subtitle}</span>}
        {showSearch && (
          <div className="ml-8 relative hidden md:block w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[20px]">search</span>
            <input
              className="w-full bg-surface-container-high border-none rounded-full py-2 pl-10 pr-4 text-body-md font-body-md focus:ring-2 focus:ring-primary focus:outline-none transition-all"
              placeholder={searchPlaceholder}
              type="text"
            />
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <button className="text-secondary hover:bg-surface-container-high p-2 rounded-full transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="text-secondary hover:bg-surface-container-high p-2 rounded-full transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2">
          <span className="material-symbols-outlined">history</span>
        </button>
        <button className="text-secondary hover:bg-surface-container-high p-2 rounded-full transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2">
          <span className="material-symbols-outlined">account_circle</span>
        </button>
      </div>
    </header>
  );
}

import logo from '../assets/images/logo.svg';

export function Header() {
  return (
    <header className="p-4 tablet:px-6 tablet:py-5">
      <div className="flex items-center justify-between gap-4">
        <img src={logo} alt="FX_Checker Logo" className="h-5 tablet:h-full" />

        <div className="text-preset-6 text-muted-foreground tablet:text-preset-4">
          55 CURRENCIES · EOD · ECB DATA
        </div>
      </div>
    </header>
  );
}

import { ThemeProvider } from '../ThemeProvider';
import Header from '../Header';

export default function ThemeProviderExample() {
  return (
    <ThemeProvider>
      <Header />
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Theme Provider Demo</h2>
        <p className="text-muted-foreground">Toggle between light and dark modes using the theme button in the header above.</p>
      </div>
    </ThemeProvider>
  );
}
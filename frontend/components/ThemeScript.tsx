/**
 * Inline script that runs before React hydrates to apply the saved theme (or
 * system preference) immediately — prevents a flash of the wrong mode.
 */
export function ThemeScript() {
  const script = `
    (function () {
      try {
        var stored = localStorage.getItem('theme');
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        var theme = stored === 'light' || stored === 'dark' ? stored : (prefersDark ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', theme === 'dark');
      } catch (e) {}
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

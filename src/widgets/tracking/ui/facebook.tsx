import { useEffect } from 'react';

// Расширение интерфейса Window для TypeScript
declare global {
  interface Window {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    fbq?: (...args: any[]) => void;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    _fbq?: (...args: any[]) => void;
  }
}

export const Facebook: React.FC = () => {
  useEffect(() => {
    // Meta Pixel Code // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    ((f: Window, b: Document, e: string, v: string, n?: any, t?: HTMLScriptElement, s?: Node) => {
      if (f.fbq) return;
      // biome-ignore lint/style/noParameterAssign: <explanation>
      // biome-ignore lint/complexity/useArrowFunction: <explanation>
      n = f.fbq = function () {
        // biome-ignore lint/style/noArguments: <explanation>
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];
      // biome-ignore lint/style/noParameterAssign: <explanation>
      t = b.createElement(e) as HTMLScriptElement;
      t.async = true;
      t.src = v;
      // biome-ignore lint/style/noParameterAssign: <explanation>
      s = b.getElementsByTagName(e)[0];
      if (s.parentNode) {
        s.parentNode.insertBefore(t, s);
      }
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    window?.fbq?.('init', '319220093565424');
    window?.fbq?.('track', 'PageView');
  }, []);

  return (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: 'none' }}
        src="https://www.facebook.com/tr?id=319220093565424&ev=PageView&noscript=1"
        alt="Facebook Pixel"
      />
    </noscript>
  );
};

import { useEffect } from 'react';

// Расширение интерфейса Window для TypeScript
declare global {
  interface Window {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    hj: any;
    _hjSettings: { hjid: number; hjsv: number };
  }
}

export const Hotjar = () => {
  useEffect(() => {
    if (!window.hj) {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      ((h: Window, o: Document, t: string, j: string, a?: any, r?: any) => {
        h.hj =
          h.hj ||
          // biome-ignore lint/complexity/useArrowFunction: <explanation>
          function () {
            // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
            // biome-ignore lint/style/noArguments: <explanation>
            (h.hj.q = h.hj.q || []).push(arguments);
          };
        h._hjSettings = { hjid: 3116989, hjsv: 6 };

        // biome-ignore lint/style/noParameterAssign: <explanation>
        a = o.getElementsByTagName('head')[0];
        // biome-ignore lint/style/noParameterAssign: <explanation>
        r = o.createElement('script');
        r.async = true;
        r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
        if (a) {
          a.appendChild(r);
        }
      })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
    }
  }, []);

  return null;
};

import { Drawer } from 'vaul';

export function MyDrawer({ button, className, children }) {
  return (
    <Drawer.Root shouldScaleBackground>
      <Drawer.Trigger asChild>{button}</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content
          className={`flex flex-col fixed bottom-0 left-0 right-0 ${className}`}
        >
          <div className="px-6 bg-white rounded-t-[10px] flex-1 overflow-auto">
            <div className="sticky top-0 flex items-center justify-center w-full h-10 bg-white">
              <div className="w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300" />
            </div>
            <div className="">{children}</div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

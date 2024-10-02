export function buttonizeA11Y(
    handlerFn?: (event: React.KeyboardEvent | React.MouseEvent) => void
  ): {
    role: string;
    onClick?: (event: React.MouseEvent) => void;
    onKeyDown: (event: React.KeyboardEvent) => void;
  } {
    return {
      role: 'button',
      onClick: handlerFn,
      onKeyDown: (event) => {
        // insert your preferred method for detecting the keypress
        if ((event.keyCode === 13 || event.keyCode === 32) && handlerFn) handlerFn(event);
      },
    };
  }
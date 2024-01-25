import React, { FC, useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type ChildrenProps = {
  closeWindow: () => void;
  openWindow: () => void;
  isDetached: boolean;
};

const Detachable: FC<{ title?: string; children: FC<ChildrenProps> }> = ({ children, title }) => {
  const [isDetached, setIsDetached] = useState(false);

  const container = useRef(document.createElement('div'));
  const detachedWindow = useRef<Window | null>(null);

  const openWindow = useCallback(() => {
    container.current.classList.add('bg-neutral-900', 'text-lime-600', 'min-h-dvh');
    detachedWindow.current = window.open('', '', 'width=600,height=400,left=200,top=200');
    if (detachedWindow.current) {
      detachedWindow.current.document.title = title || window.document.title;
      detachedWindow.current.document.body.appendChild(container.current);
      copyStyles(window.document, detachedWindow.current.document);

      setIsDetached(true);
      detachedWindow.current?.addEventListener('beforeunload', () => {
        setIsDetached(false);
      });
    }
  }, []);

  const closeWindow = useCallback(() => {
    setIsDetached(false);
    if (detachedWindow.current) {
      detachedWindow.current?.close();
      detachedWindow.current = null;
    }
  }, []);

  return (
    <>
      {isDetached ? (
        createPortal(<div>{children({ closeWindow, openWindow, isDetached })}</div>, container.current)
      ) : (
        <>{children({ closeWindow, openWindow, isDetached })}</>
      )}
    </>
  );
};

export default Detachable;

function copyStyles(sourceDoc: Window['document'], targetDoc: Window['document']) {
  Array.from(sourceDoc.styleSheets).forEach((styleSheet) => {
    if (styleSheet.cssRules) {
      // for <style> elements
      const newStyleEl = sourceDoc.createElement('style');

      Array.from(styleSheet.cssRules).forEach((cssRule) => {
        // write the text of each rule into the body of the style element
        newStyleEl.appendChild(sourceDoc.createTextNode(cssRule.cssText));
      });

      targetDoc.head.appendChild(newStyleEl);
    } else if (styleSheet.href) {
      // for <link> elements loading CSS from a URL
      const newLinkEl = sourceDoc.createElement('link');

      newLinkEl.rel = 'stylesheet';
      newLinkEl.href = styleSheet.href;
      targetDoc.head.appendChild(newLinkEl);
    }
  });
}

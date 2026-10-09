/** Tie an open popup to its visible owner, including portal popups.
 * Libraries handle outside clicks, but cannot detect desktop toolbar hiding.
 * Does not change selection. Dispose the watcher on close or unmount. */
export function observePopupOwner(owner: HTMLElement, dismiss: () => void): () => void {
  const document = owner.ownerDocument;
  const view = document.defaultView;
  if (!view) return () => {};
  const check = () => {
    if (document.hidden || !owner.isConnected || owner.matches(':disabled')) { dismiss(); return; }
    for (let node: HTMLElement | null = owner; node; node = node.parentElement) {
      const style = view.getComputedStyle(node);
      if (node.hasAttribute('hidden') || node.hasAttribute('inert') || style.display === 'none' || style.visibility === 'hidden' || style.visibility === 'collapse') {
        dismiss(); return;
      }
    }
  };
  const visibility = () => { if (document.hidden) dismiss(); };
  const observer = new view.MutationObserver(check);
  for (let node: HTMLElement | null = owner; node; node = node.parentElement) {
    observer.observe(node, { attributes: true, attributeFilter: ['hidden', 'inert', 'style', 'class', 'disabled'], childList: true });
  }
  view.addEventListener('blur', dismiss);
  view.addEventListener('pagehide', dismiss);
  document.addEventListener('visibilitychange', visibility);
  check();
  return () => {
    observer.disconnect();
    view.removeEventListener('blur', dismiss);
    view.removeEventListener('pagehide', dismiss);
    document.removeEventListener('visibilitychange', visibility);
  };
}

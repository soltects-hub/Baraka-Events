import { Fragment } from 'react';

/** Text helpers for the Food Menu 2026-27 (FoodMenus.tsx and the homepage menu rows): the wording is printed exactly. */
/**
 * Renders a line that may contain slashes ("Gulab Jamun/Jalebi/Kulfa/...") so that a long list can wrap
 * after any slash on a narrow screen. A <wbr> adds a break opportunity, not a character: the text stays
 * exactly as the menu prints it.
 */
export function SoftSlashes({ text }: { text: string }) {
  return (
    <>
      {text.split('/').map((part, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <>
              /<wbr />
            </>
          )}
          {part}
        </Fragment>
      ))}
    </>
  );
}

export function Lines({ text }: { text: string }) {
  return (
    <>
      {text.split('\n').map((line, i) => (
        <span key={i} className="block">
          <SoftSlashes text={line} />
        </span>
      ))}
    </>
  );
}

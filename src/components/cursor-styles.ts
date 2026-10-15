import { css } from "@gluon/gluon";

/**
 * Keeps the Overwatch cursor over links and form controls.
 *
 * The document gives every element the cursor (see `styles/global.css`), but
 * that rule does not reach into shadow roots: elements there only inherit it,
 * and the browser's own styles give links a pointer, text inputs an I-beam
 * and buttons an arrow. Every component that renders one of these includes
 * this sheet in its `styles`.
 */
export const cursorStyles = css`
  a,
  button,
  input,
  select,
  textarea,
  label {
    cursor: inherit;
  }
`;

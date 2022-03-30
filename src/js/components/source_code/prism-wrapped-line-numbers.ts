import Prism from 'prismjs/components/prism-core';


/**
 * Creates HTML (as a text) for numbered line.
 *
 * Numbered line is essentially a list item with a wrapping division
 * inside.
 *
 * Suffix helps repeated Prism calls to maintain the same code
 * formatting. Prism works with `textContent` of a code element, there
 * block elements are not enough and a line feed character can be
 * added if needed.
 *
 * @param {Object} env
 * @param {string} suffix
 * @param {string} htmlLine}
 * @return {string}
 */
function wrapLine(env, suffix, htmlLine) {
  return '' +
    '<li role="presentation"><div class="line">' +
      `${htmlLine}${suffix}` +
    '</div></li>';
}


/**
 * Finds explicit line breaks in code and wraps them in numbering
 * elements.
 *
 * Line numbers are generated via CSS counters.
 *
 * @param {Object} env
 */
function wrappedLineNumbers(env) {
  if (!env.code || !env.highlightedCode) return;

  const codeEl = env.element;
  const preEl = codeEl.parentNode;

  if (!preEl || preEl.tagName !== 'PRE' ||
      !preEl.classList.contains('line-numbers') ||
      codeEl.querySelector('.line-numbers-rows')) return;

  if (preEl.hasAttribute('data-start')) {
    preEl.style.counterReset =
      `linenumber ${parseInt(preEl.getAttribute('data-start'), 10) - 1}`;
  }

  const lines = env.highlightedCode.
    split(/(?:(?:\r?\n)|(?:<br\s*\/?>))/i);

  const numbered = lines.map(wrapLine.bind(null, env, '\n'));
  // Removes trailing new line
  numbered[numbered.length - 1] = wrapLine(env, '', lines[lines.length - 1]);

  codeEl.innerHTML = `<ol class="line-numbers-rows">${numbered.join('')}</ul>`;
}


Prism.hooks.add('after-highlight', wrappedLineNumbers);

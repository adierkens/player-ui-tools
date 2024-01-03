import React from 'react';
import devtoolsHTML from 'url:../panels/devtools/index.html';

chrome.devtools.panels.create(
  'Player UI',
  'icon.png',
  devtoolsHTML.split('/').pop()
);

/** Base extension HTML */
const IndexDevtools = () => {
  return <h2>PLAYER UI - dev tools</h2>;
};

export default IndexDevtools;

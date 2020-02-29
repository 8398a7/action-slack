import * as React from 'react';

const AnchorTag = ({ children: link, ...props }) => {
  if (link) {
    if (props.href.startsWith('/')) {
      return <a href={props.href}>{link}</a>;
    } else {
      return (
        <a href={props.href} target="_blank" rel="noopener">
          {link}
        </a>
      );
    }
  } else {
    return null;
  }
};

export default AnchorTag;

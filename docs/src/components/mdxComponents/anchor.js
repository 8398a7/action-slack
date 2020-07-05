import * as React from 'react';
import { Link as GatsbyLink } from 'gatsby';
import isAbsoluteUrl from 'is-absolute-url';

const AnchorTag = ({ children: link, ...props }) => {
  if (!link) return null;

  if (isAbsoluteUrl(props.href)) {
    return (
      <a href={props.href} target="_blank" rel="noopener noreferrer">
        {link}
      </a>
    );
  } else {
    return (
      <GatsbyLink to={props.href} {...props}>
        {link}
      </GatsbyLink>
    );
  }
};

export default AnchorTag;

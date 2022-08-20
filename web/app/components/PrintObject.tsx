//this is just a helpful little component that displays
//all the data from our customer's session
import { FC } from 'react';

interface Props {
  content: unknown;
}

const PrintObject: FC<Props> = ({ content }) => {
  const formattedContent = JSON.stringify(content, null, 2);
  return <pre>{formattedContent}</pre>;
};

export default PrintObject;

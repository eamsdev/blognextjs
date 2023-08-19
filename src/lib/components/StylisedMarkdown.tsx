/* eslint-disable react/no-children-prop */
import CodeBlock from './CodeBlock';
import ReactMarkdown from 'react-markdown';

export const StylisedMarkdown = ({ markdown }: { markdown: string }) => {
  return (
    <ReactMarkdown
      className="markdown"
      children={markdown}
      components={{
        // https://github.com/remarkjs/react-markdown#use-custom-components-syntax-highlight
        code: (props) => <CodeBlock {...props} />,
        pre: (props) => <>{props.children}</>,
      }}
    />
  );
};

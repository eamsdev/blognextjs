import { SyntaxHighlighterProps } from 'react-syntax-highlighter';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import csharp from 'react-syntax-highlighter/dist/esm/languages/prism/csharp';
import hcl from 'react-syntax-highlighter/dist/esm/languages/prism/hcl';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import scss from 'react-syntax-highlighter/dist/esm/languages/prism/scss';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism-light';
import theme from 'react-syntax-highlighter/dist/esm/styles/prism/atom-dark';

SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('csharp', csharp);
SyntaxHighlighter.registerLanguage('yaml', yaml);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('scss', scss);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('hcl', hcl);
const SyntaxHighlighterComponent = SyntaxHighlighter as any as React.FC<SyntaxHighlighterProps>;

const CodeBlock = (props: any) => {
  const { className, inline, children, ...rest } = props;
  const match = /language-(\w+)/.exec(className || '');
  return !inline ? (
    <SyntaxHighlighterComponent
      {...rest}
      style={theme}
      language={match ? match[1] : 'language-shell'}
    >
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighterComponent>
  ) : (
    <code className={className}>{children}</code>
  );
};

// https://github.com/react-syntax-highlighter/react-syntax-highlighter/issues/489#issuecomment-1316278858
export default CodeBlock;

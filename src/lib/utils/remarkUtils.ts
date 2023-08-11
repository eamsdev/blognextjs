import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import remarkParseFrontmatter from 'remark-parse-frontmatter';
import remarkStringify from 'remark-stringify';

export const remarkProcessor = unified()
  .use(remarkParse)
  .use(remarkFrontmatter)
  .use(remarkParseFrontmatter)
  .use(remarkStringify);

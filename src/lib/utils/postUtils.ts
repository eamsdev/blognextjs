import { BlogPostCardProps } from '@components/BlogPostCard';
import { strToDate } from '@utils/dateUtils';
import { remarkProcessor } from '@utils/remarkUtils';
import fs from 'fs';
import path from 'path';
import { VFile } from 'vfile';

export type PostData = {
  frontmatter: FrontMatter;
  body: string;
};

export type FrontMatter = {
  id: string;
  title: string;
  description: string;
  thumbnailPath: string;
  date: Date;
  author: string;
  readTime: string;
  meta: string;
  tags: string[];
};

const postsDirectory = path.join(process.cwd(), 'posts');
const frontmatterRegex = /---(.|\n)*?---(\n)/;
const firstParagraphRegex = /\w.*/;

export const getAllPostsCardProps = async (): Promise<BlogPostCardProps[]> => {
  var allIds = getAllPostIds().map((x) => x.params.id);
  return await Promise.all(allIds.map((x) => getCardProps(x)));
};

export const getCardProps = async (id: string): Promise<BlogPostCardProps> => {
  const markdown = getProcessedMarkdown(id);
  const frontmatter = markdown.data.frontmatter as any;
  const body = markdown.value as string;

  return {
    ...frontmatter,
    date: strToDate(frontmatter.date),
    tags: frontmatter.tags,
    preview: body.match(firstParagraphRegex)![0],
    thumbnailPath: frontmatter.thumbnailPath,
  };
};

export const getPostData = async (id: string): Promise<PostData> => {
  const markdown = getProcessedMarkdown(id);
  const frontmatter = markdown.data.frontmatter as any;
  const body = markdown.value as string;

  return {
    frontmatter: {
      ...frontmatter,
      date: strToDate(frontmatter.date),
    },
    body: body.replace(frontmatterRegex, ''),
  };
};

export const getAllPostIds = () => {
  return fs.readdirSync(postsDirectory).map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ''),
      },
    };
  });
};

const getProcessedMarkdown = (id: string): VFile => {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const markdown = new VFile(fileContents);

  remarkProcessor.run(remarkProcessor.parse(markdown as any), markdown as any);

  return markdown;
};

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

const recentPostCount = 3;
const postPerPage = 6;
const postsDirectory = path.join(process.cwd(), 'posts');
const frontmatterRegex = /---(.|\n)*?---(\n)/;
const firstParagraphRegex = /\w.*/;

export const getAllPostsCardProps = (): BlogPostCardProps[] => {
  var allPosts = getAllPostIds()
    .map((x) => getCardProps(x.params.id))
    .sort(sortByLatestDateFunc);
  return allPosts;
};

export function getCardPropsForPage(pageNumber: number) {
  const allPosts = getAllPostsCardProps();
  let cardProps = getAllPostsCardProps()
    .slice(recentPostCount + postPerPage * (pageNumber - 1)) // Take away recent posts + posts in previous pages
    .slice(0, postPerPage);

  if (cardProps.length < postPerPage) {
    cardProps = allPosts.slice(-postPerPage);
  }

  return cardProps;
}

const sortByLatestDateFunc = (a: BlogPostCardProps, b: BlogPostCardProps) => {
  return b.date.valueOf() - a.date.valueOf();
};

export const getPostData = (id: string): PostData => {
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

export const getTotalNumberOfPages = (): number => {
  const postsCount = getAllPostIds().slice(recentPostCount).length;
  const numberOfPages =
    Math.floor(postsCount / postPerPage) + (postsCount % postPerPage > 0 ? 1 : 0);

  return numberOfPages;
};

const getProcessedMarkdown = (id: string): VFile => {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const markdown = new VFile(fileContents);

  remarkProcessor.run(remarkProcessor.parse(markdown as any), markdown as any);

  return markdown;
};

const getCardProps = (id: string): BlogPostCardProps => {
  const markdown = getProcessedMarkdown(id);
  const frontmatter = markdown.data.frontmatter as any;
  const body = markdown.value as string;

  return {
    ...frontmatter,
    date: strToDate(frontmatter.date),
    tags: frontmatter.tags,
    preview: body.replace(frontmatterRegex, '').match(firstParagraphRegex)![0],
    thumbnailPath: frontmatter.thumbnailPath,
  };
};

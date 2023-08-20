'use client';

import Giscus from '@giscus/react';

export default function Discussion({ title }: { title: string }) {
  return (
    <Giscus
      id="comments"
      repo="eamsdev/MiniBlog"
      repoId="R_kgDOIgaTPw"
      category="General"
      categoryId="DIC_kwDOIgaTP84CTFoZ"
      mapping="specific"
      key={title}
      term={title}
      reactionsEnabled="1"
      emitMetadata="1"
      inputPosition="bottom"
      loading="eager"
      theme="transparent_dark"
      lang="en"
    />
  );
}

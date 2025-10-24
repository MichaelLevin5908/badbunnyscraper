import { BskyAgent, AppBskyFeedPost, LikeRecord, RepostRecord } from '@atproto/api';
import { isQuotedPost } from '@atproto/api/dist/moderation/util';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

async function main() {
  const agent = new BskyAgent({ service: 'https://bsky.social' });

  await agent.login({
    identifier: process.env.IDENTIFIER!,
    password: process.env.PASSWORD!
  });

  const response = await agent.api.app.bsky.feed.searchPosts({
    q: '#badbunny #superbowl',
    limit: 100
  });

  const posts = response.data.posts.map(post => ({
    author: post.author.displayName,
    text: (post.record as AppBskyFeedPost.Record).text,
    uri: post.uri,
    createdAt: (post.record as AppBskyFeedPost.Record).createdAt,
    likeCount: post.likeCount ?? 0,
    quoteCount: post.quoteCount ?? 0,
    replyCount: post.replyCount ?? 0,
    repostCount: post.repostCount ?? 0
  }));

  const sortedByLikes = posts.slice().sort((a, b) =>
    (b.likeCount - a.likeCount) ||
    ((new Date(b.createdAt || 0).getTime()) - (new Date(a.createdAt || 0).getTime()))
  );

  const sortedByQuotes = posts.slice().sort((a, b) =>
    (b.quoteCount - a.quoteCount) ||
    ((new Date(b.createdAt || 0).getTime()) - (new Date(a.createdAt || 0).getTime()))
  );

  const sortedByReplies = posts.slice().sort((a, b) =>
    (b.replyCount - a.replyCount) ||
    ((new Date(b.createdAt || 0).getTime()) - (new Date(a.createdAt || 0).getTime()))
  );

  const sortedByReposts = posts.slice().sort((a, b) =>
    (b.repostCount - a.repostCount) ||
    ((new Date(b.createdAt || 0).getTime()) - (new Date(a.createdAt || 0).getTime()))
  );

  fs.writeFileSync('sortedByLikes.json', JSON.stringify(sortedByLikes, null, 2));
  fs.writeFileSync('sortedByQuotes.json', JSON.stringify(sortedByQuotes, null, 2));
  fs.writeFileSync('sortedByReplies.json', JSON.stringify(sortedByReplies, null, 2));
  fs.writeFileSync('sortedByReposts.json', JSON.stringify(sortedByReposts, null, 2));

  console.log('All 100 posts sorted and saved for each metric.');
}

main().catch(console.error);
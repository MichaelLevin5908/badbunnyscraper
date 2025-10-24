import { BskyAgent, AppBskyFeedPost, LikeRecord, RepostRecord } from '@atproto/api';
import { isQuotedPost } from '@atproto/api/dist/moderation/util';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { Parser } from 'json2csv';

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

  const saveAsCSV = (data: typeof posts, filename: string) => {
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(data);
    fs.writeFileSync(filename, csv);
  };

  saveAsCSV(sortedByLikes, 'sortedByLikes.csv');
  saveAsCSV(sortedByQuotes, 'sortedByQuotes.csv');
  saveAsCSV(sortedByReplies, 'sortedByReplies.csv');
  saveAsCSV(sortedByReposts, 'sortedByReposts.csv');

  console.log('All 100 posts sorted and saved as CSV for each metric.');
}

main().catch(console.error);
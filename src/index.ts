import { BskyAgent, AppBskyFeedPost } from '@atproto/api';
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
    q: '#badbunny OR #superbowl',
    limit: 100
  });

  const posts = response.data.posts.map(post => ({
    author: post.author.displayName,
    text: (post.record as AppBskyFeedPost.Record).text,
    uri: post.uri,
    createdAt: (post.record as AppBskyFeedPost.Record).createdAt
  }));

  fs.writeFileSync('posts.json', JSON.stringify(posts, null, 2));
  console.log('Posts saved to posts.json');
}

main().catch(console.error);
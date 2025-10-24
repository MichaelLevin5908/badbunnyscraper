import { BskyAgent, AppBskyFeedPost } from '@atproto/api';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  const agent = new BskyAgent({ service: 'https://bsky.social' });

  // Login with your credentials from .env
  await agent.login({
    identifier: process.env.IDENTIFIER!,
    password: process.env.PASSWORD!
  });

  // Search for posts with #badbunny or #superbowl
  const response = await agent.api.app.bsky.feed.searchPosts({
    q: '#badbunny OR #superbowl',
    limit: 100
  });

  console.log('Posts for #badbunny or #superbowl:');
  response.data.posts.forEach(post => {
    const record = post.record as AppBskyFeedPost.Record;
    console.log(`- ${post.author.displayName}: ${record.text}`);
  });
}

main().catch(console.error);
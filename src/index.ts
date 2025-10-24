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

  // Search for posts with #badbunny
  const badbunnyResponse = await agent.api.app.bsky.feed.searchPosts({
    q: '#badbunny',
    limit: 10
  });

  console.log('Posts for #badbunny:');
  badbunnyResponse.data.posts.forEach(post => {
    const record = post.record as AppBskyFeedPost.Record;
    console.log(`- ${post.author.displayName}: ${record.text}`);
  });

  // Search for posts with #superbowl (assuming it's #superbowl)
  const superbowlResponse = await agent.api.app.bsky.feed.searchPosts({
    q: '#superbowl',
    limit: 10
  });

  console.log('\nPosts for #superbowl:');
  superbowlResponse.data.posts.forEach(post => {
    const record = post.record as AppBskyFeedPost.Record;
    console.log(`- ${post.author.displayName}: ${record.text}`);
  });
}

main().catch(console.error);
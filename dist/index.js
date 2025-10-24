"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@atproto/api");
async function main() {
    const agent = new api_1.BskyAgent({ service: 'https://bsky.social' });
    // Login with your credentials
    await agent.login({
        identifier: 'your-handle.bsky.social', // replace with your handle
        password: 'your-password' // replace with your password
    });
    // Search for posts with #badbunny
    const badbunnyResponse = await agent.api.app.bsky.feed.searchPosts({
        q: '#badbunny',
        limit: 10
    });
    console.log('Posts for #badbunny:');
    badbunnyResponse.data.posts.forEach(post => {
        const record = post.record;
        console.log(`- ${post.author.displayName}: ${record.text}`);
    });
    // Search for posts with #superbowl (assuming it's #superbowl)
    const superbowlResponse = await agent.api.app.bsky.feed.searchPosts({
        q: '#superbowl',
        limit: 10
    });
    console.log('\nPosts for #superbowl:');
    superbowlResponse.data.posts.forEach(post => {
        const record = post.record;
        console.log(`- ${post.author.displayName}: ${record.text}`);
    });
}
main().catch(console.error);

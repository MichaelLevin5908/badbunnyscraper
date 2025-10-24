"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@atproto/api");
const dotenv = __importStar(require("dotenv"));
const fs = __importStar(require("fs"));
dotenv.config();
async function main() {
    const agent = new api_1.BskyAgent({ service: 'https://bsky.social' });
    await agent.login({
        identifier: process.env.IDENTIFIER,
        password: process.env.PASSWORD
    });
    const response = await agent.api.app.bsky.feed.searchPosts({
        q: '#badbunny #superbowl',
        limit: 100
    });
    const posts = response.data.posts.map(post => ({
        author: post.author.displayName,
        text: post.record.text,
        uri: post.uri,
        createdAt: post.record.createdAt,
        likeCount: post.likeCount ?? 0,
        quoteCount: post.quoteCount ?? 0,
        replyCount: post.replyCount ?? 0,
        repostCount: post.repostCount ?? 0
    }));
    const sortedByLikes = posts.slice().sort((a, b) => (b.likeCount - a.likeCount) ||
        ((new Date(b.createdAt || 0).getTime()) - (new Date(a.createdAt || 0).getTime())));
    const sortedByQuotes = posts.slice().sort((a, b) => (b.quoteCount - a.quoteCount) ||
        ((new Date(b.createdAt || 0).getTime()) - (new Date(a.createdAt || 0).getTime())));
    const sortedByReplies = posts.slice().sort((a, b) => (b.replyCount - a.replyCount) ||
        ((new Date(b.createdAt || 0).getTime()) - (new Date(a.createdAt || 0).getTime())));
    const sortedByReposts = posts.slice().sort((a, b) => (b.repostCount - a.repostCount) ||
        ((new Date(b.createdAt || 0).getTime()) - (new Date(a.createdAt || 0).getTime())));
    fs.writeFileSync('sortedByLikes.json', JSON.stringify(sortedByLikes, null, 2));
    fs.writeFileSync('sortedByQuotes.json', JSON.stringify(sortedByQuotes, null, 2));
    fs.writeFileSync('sortedByReplies.json', JSON.stringify(sortedByReplies, null, 2));
    fs.writeFileSync('sortedByReposts.json', JSON.stringify(sortedByReposts, null, 2));
    console.log('All 100 posts sorted and saved for each metric.');
}
main().catch(console.error);

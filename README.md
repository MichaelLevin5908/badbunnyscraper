# BlueSky Post Scraper

This TypeScript project uses the official BlueSky API to scrape posts for specific hashtags.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with your BlueSky credentials:
   ```
   IDENTIFIER=your-handle.bsky.social
   PASSWORD=your-password
   ```

3. Build the project:
   ```
   npm run build
   ```

## Usage

Run the scraper:
```
npm start
```

This will search for posts containing `#badbunny` and `#superbowl` and print them to the console.

## Notes

- The search is limited to 10 posts per hashtag for demonstration.
- For production use, consider implementing pagination and proper error handling.
- Ensure you have a BlueSky account and comply with their terms of service.
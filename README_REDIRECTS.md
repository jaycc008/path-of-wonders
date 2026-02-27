# Redirect Configuration for Static Site Deployment

## Problem
When external services (like Stripe) redirect back to your site, the server tries to find a file at that path (e.g., `/book/success`) instead of serving your React app's `index.html`. This causes 404 errors.

## Solution
I've created configuration files for different hosting platforms. Use the one that matches your hosting provider:

### 1. **Vercel** (vercel.json)
- Already created in the root directory
- Automatically used by Vercel deployments
- Rewrites all routes to `/index.html`

### 2. **Netlify** (netlify.toml or public/_redirects)
- `netlify.toml` - Already created in root
- `public/_redirects` - Already created (alternative method)
- Both files do the same thing - use one or the other

### 3. **Apache** (public/.htaccess)
- Already created in `public/` directory
- Will be copied to `dist/` during build
- Works for Apache-based hosting (cPanel, shared hosting, etc.)

### 4. **Nginx** (nginx.conf)
If you're using Nginx, add this to your server configuration:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### 5. **GitHub Pages**
For GitHub Pages, you'll need to:
1. Use `public/_redirects` (already created)
2. Or configure in GitHub Pages settings to serve `index.html` for all routes

### 6. **Cloudflare Pages**
- Uses `public/_redirects` automatically
- Already created and will work

## How It Works
All these configurations do the same thing:
- When a request comes in for any route (e.g., `/book/success?session_id=...`)
- The server checks if a file exists at that path
- If not, it serves `index.html` instead
- React Router then handles the routing on the client side

## Testing
After deploying with the appropriate config file:
1. Build your site: `npm run build`
2. Deploy to your hosting platform
3. Test by navigating directly to: `https://yoursite.com/book/success?session_id=test`
4. It should load your React app instead of showing a 404

## Important Notes
- **Vercel**: Uses `vercel.json` automatically
- **Netlify**: Uses `netlify.toml` or `public/_redirects` automatically
- **Apache**: Make sure `.htaccess` files are enabled on your server
- **Nginx**: You need to manually add the config to your server
- The `public/` directory files are automatically copied to `dist/` during Vite build


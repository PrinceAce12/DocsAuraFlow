# Production Deployment Guide

This guide covers deploying the Document & Image Suite to production environments.

## 🚀 Quick Start

### Option 1: Vercel (Recommended)

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy to Vercel
   vercel --prod
   ```

2. **Set Environment Variables**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add all variables from `env.example`

3. **Configure Custom Domain** (Optional)
   - Add your domain in Vercel Dashboard
   - Update DNS records as instructed

### Option 2: Docker Deployment

1. **Build and Run**
   ```bash
   # Build Docker image
   npm run docker:build
   
   # Run container
   npm run docker:run
   ```

2. **Using Docker Compose**
   ```bash
   # Start all services
   npm run docker:compose
   
   # Stop services
   npm run docker:compose:down
   ```

### Option 3: Traditional Server

1. **Prepare Server**
   ```bash
   # Install Node.js 18+
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2 for process management
   npm install -g pm2
   ```

2. **Deploy Application**
   ```bash
   # Clone repository
   git clone <your-repo-url>
   cd pdf-to-word-converter
   
   # Install dependencies
   npm ci --only=production
   
   # Build application
   npm run build
   
   # Start with PM2
   pm2 start npm --name "document-suite" -- start
   pm2 save
   pm2 startup
   ```

## 🔧 Environment Configuration

### Required Environment Variables

Create `.env.production` with the following:

```env
# AdSense Configuration
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-3383149380786147

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME="Document & Image Suite"

# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://yourdomain.com/api

# File Upload Limits (in bytes)
NEXT_PUBLIC_MAX_FILE_SIZE=52428800
NEXT_PUBLIC_MAX_IMAGE_SIZE=10485760

# Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID=GTM-XXXXXXX

# Security
NEXT_PUBLIC_CSP_NONCE=your-csp-nonce-here

# Feature Flags
NEXT_PUBLIC_ENABLE_ADS=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_PREMIUM_FEATURES=false
```

### AdSense Setup

1. **Get AdSense Account**
   - Sign up at [Google AdSense](https://www.google.com/adsense)
   - Wait for approval (can take 1-2 weeks)

2. **Create Ad Units**
   - Go to AdSense Dashboard → Ads → By ad unit
   - Create ad units for each placement:
     - Header Ad (728x90)
     - Sidebar Ad (300x250)
     - Footer Ad (728x90)
     - In-Content Ad (300x250)
     - Mobile Ad (responsive)

3. **Update Ad Slots**
   - Replace placeholder slots in `src/components/AdSense.tsx`
   - Update `AD_CLIENT` with your publisher ID

## 🔒 Security Considerations

### SSL/TLS Configuration

```nginx
# Nginx configuration example
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Content Security Policy

Add to your `next.config.ts`:

```typescript
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: `
            default-src 'self';
            script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com;
            style-src 'self' 'unsafe-inline';
            img-src 'self' data: https:;
            font-src 'self';
            connect-src 'self';
            frame-src https://googleads.g.doubleclick.net;
          `.replace(/\s+/g, ' ').trim()
        }
      ]
    }
  ]
}
```

## 📊 Monitoring & Analytics

### Health Checks

The application includes a health check endpoint:

```bash
# Check application health
curl https://yourdomain.com/api/health

# Expected response
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "environment": "production",
  "version": "1.0.0",
  "memory": {
    "used": 150,
    "total": 200
  },
  "services": {
    "pdf_conversion": "operational",
    "image_processing": "operational",
    "background_removal": "operational",
    "resume_builder": "operational"
  }
}
```

### Google Analytics Setup

1. **Create GA4 Property**
   - Go to [Google Analytics](https://analytics.google.com)
   - Create new property
   - Get Measurement ID

2. **Add to Application**
   ```typescript
   // Add to layout.tsx
   <Script
     src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
     strategy="afterInteractive"
   />
   <Script id="google-analytics" strategy="afterInteractive">
     {`
       window.dataLayer = window.dataLayer || [];
       function gtag(){dataLayer.push(arguments);}
       gtag('js', new Date());
       gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
     `}
   </Script>
   ```

## 🚀 Performance Optimization

### Image Optimization

```bash
# Optimize images before deployment
npm install -g imagemin-cli
imagemin public/**/*.{jpg,jpeg,png,gif,svg} --out-dir=public/optimized
```

### Caching Strategy

```typescript
// Add to next.config.ts
async headers() {
  return [
    {
      source: '/(.*\\.(jpg|jpeg|png|gif|webp|avif|svg))',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    {
      source: '/api/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-cache, no-store, must-revalidate',
        },
      ],
    },
  ]
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build application
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 📈 Scaling Considerations

### Horizontal Scaling

```yaml
# docker-compose.yml with load balancer
version: '3.8'
services:
  app1:
    build: .
    environment:
      - NODE_ENV=production
    restart: unless-stopped
  
  app2:
    build: .
    environment:
      - NODE_ENV=production
    restart: unless-stopped
  
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - app1
      - app2
```

### Database Considerations

For high-traffic applications, consider:

1. **Redis for Caching**
   ```bash
   # Add Redis to docker-compose.yml
   redis:
     image: redis:7-alpine
     ports:
       - "6379:6379"
   ```

2. **CDN for Static Assets**
   - Use Cloudflare, AWS CloudFront, or similar
   - Configure custom domain with CDN

## 🛠️ Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and rebuild
   npm run clean
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Memory Issues**
   ```bash
   # Increase Node.js memory limit
   export NODE_OPTIONS="--max-old-space-size=4096"
   npm run build
   ```

3. **AdSense Not Loading**
   - Check if domain is approved in AdSense
   - Verify ad slots are correctly configured
   - Check browser console for errors

### Logs and Debugging

```bash
# View application logs
pm2 logs document-suite

# Monitor resources
pm2 monit

# Check health endpoint
curl -f http://localhost:3000/api/health
```

## 📞 Support

For production issues:

1. Check the health endpoint first
2. Review application logs
3. Monitor server resources
4. Check AdSense dashboard for ad performance
5. Verify all environment variables are set correctly

## 🔄 Updates and Maintenance

### Regular Maintenance

1. **Weekly**
   - Check health endpoint
   - Monitor error logs
   - Review AdSense performance

2. **Monthly**
   - Update dependencies
   - Review security patches
   - Analyze performance metrics

3. **Quarterly**
   - Full security audit
   - Performance optimization review
   - Feature updates and improvements 
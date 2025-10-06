// In-memory cache store
const cacheStore = new Map<string, { data: any; expiry: number }>();

// Cleanup expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cacheStore.entries()) {
    if (now > value.expiry) {
      cacheStore.delete(key);
    }
  }
}, 5 * 60 * 1000); // 5 minutes

// Cache configuration
const CACHE_TTL = {
  GALLERY_ITEMS: 300, // 5 minutes
  OFFERS: 300, // 5 minutes
  CAROUSEL: 600, // 10 minutes
  SELFIE_POINTS: 300, // 5 minutes
  ACTIVITIES: 300, // 5 minutes
  STATIC_CONTENT: 3600, // 1 hour
};

// Cache utility functions
export class CacheService {
  // Get data from cache
  static async get<T>(key: string): Promise<T | null> {
    try {
      const cached = cacheStore.get(key);
      if (!cached) {
        return null;
      }
      
      // Check if expired
      if (Date.now() > cached.expiry) {
        cacheStore.delete(key);
        return null;
      }
      
      return cached.data;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  // Set data in cache
  static async set(key: string, data: any, ttl: number = 300): Promise<void> {
    try {
      const expiry = Date.now() + (ttl * 1000);
      cacheStore.set(key, { data, expiry });
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  // Delete data from cache
  static async del(key: string): Promise<void> {
    try {
      cacheStore.delete(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  // Delete multiple keys with pattern
  static async delPattern(pattern: string): Promise<void> {
    try {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      for (const key of cacheStore.keys()) {
        if (regex.test(key)) {
          cacheStore.delete(key);
        }
      }
    } catch (error) {
      console.error('Cache delete pattern error:', error);
    }
  }

  // Generate cache key
  static generateKey(prefix: string, params: Record<string, any> = {}): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|');
    
    return sortedParams ? `${prefix}:${sortedParams}` : prefix;
  }

  // Cache middleware for API responses
  static cacheMiddleware(ttl: number = 300) {
    return async (req: any, res: any, next: any) => {
      const originalSend = res.send;
      const cacheKey = CacheService.generateKey(
        `${req.route?.path || req.path}`,
        req.query
      );

      // Try to get from cache
      const cachedData = await CacheService.get(cacheKey);
      if (cachedData) {
        res.json(cachedData);
        return;
      }

      // Override res.send to cache the response
      res.send = function(data: any) {
        // Cache the response
        CacheService.set(cacheKey, data, ttl);
        originalSend.call(this, data);
      };

      next();
    };
  }
}

// Cache keys
export const CACHE_KEYS = {
  GALLERY_ITEMS: 'gallery:items',
  GALLERY_ITEM: 'gallery:item',
  OFFERS: 'offers:items',
  OFFER: 'offers:item',
  CAROUSEL_ITEMS: 'carousel:items',
  CAROUSEL_ITEM: 'carousel:item',
  SELFIE_POINTS: 'selfie:points',
  SELFIE_POINT: 'selfie:point',
  ACTIVITIES: 'activities:items',
  ACTIVITY: 'activities:item',
};

export { CACHE_TTL };


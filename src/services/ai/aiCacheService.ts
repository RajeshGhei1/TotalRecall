
export interface CacheMetrics {
  totalRequests: number;
  cacheHits: number;
  cacheHitRate: number;
  cacheSize: number;
  oldestCacheEntry?: Date;
  newestCacheEntry?: Date;
}

export interface CachedResponse {
  data: Record<string, unknown>;
  timestamp: Date;
  hitCount: number;
  expiresAt: Date;
}

export class AICacheService {
  private cache: Map<string, CachedResponse> = new Map();
  private totalRequests = 0;
  private cacheHits = 0;
  private readonly DEFAULT_TTL = 30 * 60 * 1000; // 30 minutes

  generateCacheKey(request: Record<string, unknown>): string {
    const { context, parameters } = request;
    const keyData = {
      module: (context as Record<string, unknown>).module,
      action: (context as Record<string, unknown>).action,
      entity_type: (context as Record<string, unknown>).entity_type,
      entity_id: (context as Record<string, unknown>).entity_id,
      tenant_id: (context as Record<string, unknown>).tenant_id,
      parameters: JSON.stringify(parameters)
    };
    
    return btoa(JSON.stringify(keyData)).replace(/[+/=]/g, '');
  }

  async checkCache(request: Record<string, unknown>): Promise<Record<string, unknown> | null> {
    this.totalRequests++;
    
    const cacheKey = this.generateCacheKey(request);
    const cached = this.cache.get(cacheKey);

    if (!cached) {
      return null;
    }

    // Check if cache entry has expired
    if (new Date() > cached.expiresAt) {
      this.cache.delete(cacheKey);
      return null;
    }

    // Update hit count and increment cache hits
    cached.hitCount++;
    this.cacheHits++;
    
    console.log(`Cache hit for key: ${cacheKey.substring(0, 10)}...`);
    return cached.data;
  }

  async cacheResponse(request: Record<string, unknown>, response: Record<string, unknown>, ttl?: number): Promise<void> {
    const cacheKey = this.generateCacheKey(request);
    const expirationTime = ttl || this.DEFAULT_TTL;
    
    const cachedResponse: CachedResponse = {
      data: response,
      timestamp: new Date(),
      hitCount: 0,
      expiresAt: new Date(Date.now() + expirationTime)
    };

    this.cache.set(cacheKey, cachedResponse);
    
    // Clean up expired entries periodically
    if (this.cache.size % 100 === 0) {
      this.cleanupExpiredEntries();
    }

    console.log(`Cached response for key: ${cacheKey.substring(0, 10)}...`);
  }

  private cleanupExpiredEntries(): void {
    const now = new Date();
    let cleanedCount = 0;

    for (const [key, cached] of this.cache.entries()) {
      if (now > cached.expiresAt) {
        this.cache.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`Cleaned up ${cleanedCount} expired cache entries`);
    }
  }

  getCacheMetrics(): CacheMetrics {
    const cacheHitRate = this.totalRequests > 0 ? (this.cacheHits / this.totalRequests) * 100 : 0;
    
    let oldestEntry: Date | undefined;
    let newestEntry: Date | undefined;

    for (const cached of this.cache.values()) {
      if (!oldestEntry || cached.timestamp < oldestEntry) {
        oldestEntry = cached.timestamp;
      }
      if (!newestEntry || cached.timestamp > newestEntry) {
        newestEntry = cached.timestamp;
      }
    }

    return {
      totalRequests: this.totalRequests,
      cacheHits: this.cacheHits,
      cacheHitRate: Math.round(cacheHitRate * 100) / 100,
      cacheSize: this.cache.size,
      oldestCacheEntry: oldestEntry,
      newestCacheEntry: newestEntry
    };
  }

  incrementTotalRequests(): void {
    this.totalRequests++;
  }

  clearCache(): void {
    this.cache.clear();
    console.log('AI cache cleared');
  }

  getCacheSize(): number {
    return this.cache.size;
  }

  // Get cache entries for debugging/monitoring
  getCacheEntries(): Array<{ key: string; cached: Omit<CachedResponse, 'data'> & { data: string } }> {
    return Array.from(this.cache.entries()).map(([key, cached]) => ({
      key: key.substring(0, 10) + '...',
      cached: {
        ...cached,
        data: '[Hidden for brevity]'
      }
    }));
  }

  // Manually invalidate cache for specific patterns
  invalidatePattern(pattern: string): number {
    let invalidatedCount = 0;
    
    for (const [key, _] of this.cache.entries()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
        invalidatedCount++;
      }
    }

    console.log(`Invalidated ${invalidatedCount} cache entries matching pattern: ${pattern}`);
    return invalidatedCount;
  }
}

export const aiCacheService = new AICacheService();

/**
 * Supabase Client Configuration
 * Simple REST API wrapper for Naisy website
 */

(function() {
    'use strict';

    // Supabase Configuration
    const SUPABASE_URL = 'https://lzrlzuqzywzilbsirsje.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6cmx6dXF6eXd6aWxic2lyc2plIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzODk2NTMsImV4cCI6MjA3NTk2NTY1M30.nFRvREiw8Km4B-OcylNM247zl54oXKgfVOgDR8q9LK0';
    
    // Cache duration (30 minutes)
    const CACHE_DURATION = 30 * 60 * 1000;

    /**
     * Make API request to Supabase
     */
    async function fetchFromSupabase(table, params = {}) {
        try {
            // Build query URL
            let url = `${SUPABASE_URL}/rest/v1/${table}`;
            const queryParams = new URLSearchParams();

            // Add filters
            if (params.select) {
                queryParams.append('select', params.select);
            }
            if (params.eq) {
                Object.entries(params.eq).forEach(([key, value]) => {
                    queryParams.append(key, `eq.${value}`);
                });
            }
            if (params.order) {
                queryParams.append('order', params.order);
            }

            const queryString = queryParams.toString();
            if (queryString) {
                url += '?' + queryString;
            }

            // Make request
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Supabase error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching from Supabase:', error);
            return null;
        }
    }

    /**
     * Get data with caching
     */
    async function getCachedData(cacheKey, fetchFunction) {
        // Check cache
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            const age = Date.now() - timestamp;
            
            if (age < CACHE_DURATION) {
                return data;
            }
        }

        // Fetch fresh data
        const data = await fetchFunction();
        
        if (data) {
            // Store in cache
            localStorage.setItem(cacheKey, JSON.stringify({
                data,
                timestamp: Date.now()
            }));
        }

        return data;
    }

    /**
     * Clear cache for specific key or all cache
     */
    function clearCache(cacheKey = null) {
        if (cacheKey) {
            localStorage.removeItem(cacheKey);
        } else {
            // Clear all naisy cache
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('naisy_')) {
                    localStorage.removeItem(key);
                }
            });
        }
    }

    // Export to global scope
    window.NaisyDB = {
        fetch: fetchFromSupabase,
        getCached: getCachedData,
        clearCache: clearCache
    };
})();

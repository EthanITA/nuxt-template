import base from "~/composables/api/base";
import type { AsyncDataRequestStatus } from "#app";
import { type WatchOptions, type WatchSource } from "vue";

type Url = Parameters<typeof $fetch>[0];
type Options = Parameters<typeof $fetch>[1];
export const $api = <T>(url: Url, options?: Options) => {
  return $fetch<T>(url, {
    onResponse: ({ response }) => {},
    ...options,
  });
};

interface CacheEntry<T> {
  value: T;
  timestamp: number;
}

const globalCache = new Map<string, CacheEntry<unknown>>();
const inFlightRequests = new Map<string, Promise<unknown>>();

interface UseApiOptions extends WatchOptions {
  ttl?: number;
  key?: string;
}

export function $useApi<T, A extends unknown[] = [], E = unknown>(
  fn: (...args: A) => Promise<T>,
  deps: WatchSource | WatchSource[] = () => [],
  opts: UseApiOptions = {},
) {
  const status = ref<AsyncDataRequestStatus>("idle");
  const error = ref<E | null>(null);
  const data = ref<T>();

  const ttl = opts.ttl ?? 0;
  const prefix = opts.key ?? Date.now().toString();
  const generateCacheKey = (args: A) => `${prefix}:${JSON.stringify(args)}`;
  const isCacheValid = (entry: CacheEntry<T>) => {
    return Date.now() - entry.timestamp < ttl;
  };
  const getCachedValue = (args: A): T | undefined => {
    const cacheKey = generateCacheKey(args);
    const entry = globalCache.get(cacheKey) as CacheEntry<T> | undefined;
    if (!entry) return undefined;

    if (isCacheValid(entry)) {
      return entry.value;
    }

    globalCache.delete(cacheKey);
    return undefined;
  };
  const setCachedValue = (args: A, value: T) => {
    globalCache.set(generateCacheKey(args), { value, timestamp: Date.now() });
  };

  const fetchData = async (...args: A): Promise<T> => {
    const cacheKey = generateCacheKey(args);

    if (inFlightRequests.has(cacheKey)) {
      return inFlightRequests.get(cacheKey) as Promise<T>;
    }

    const requestPromise = (async () => {
      try {
        const result = await fn(...args);
        if (ttl) setCachedValue(args, result);
        return result;
      } finally {
        inFlightRequests.delete(cacheKey);
      }
    })();

    inFlightRequests.set(cacheKey, requestPromise);
    return requestPromise;
  };

  const refresh = async (...args: A): Promise<T | undefined> => {
    const cached = getCachedValue(args);
    if (cached !== undefined) {
      data.value = cached;
      status.value = "success";
      return cached;
    }

    status.value = "pending";
    error.value = null;
    try {
      const result = await fetchData(...args);
      // @ts-ignore
      if (result?.error) throw result.error;
      data.value = result;
      status.value = "success";
      return result;
    } catch (e) {
      error.value = e as E;
      status.value = "error";
    }
  };

  const clear = () => {
    status.value = "idle";
    error.value = null;
    data.value = undefined;

    for (const key of globalCache.keys()) {
      if (key.startsWith(prefix + ":")) {
        globalCache.delete(key);
      }
    }
  };

  // @ts-ignore
  watch(deps, () => refresh(), { immediate: true, ...opts });

  return {
    status,
    isPending: computed(() => status.value === "pending"),
    isSuccess: computed(() => status.value === "success"),
    isError: computed(() => status.value === "error"),
    isIdle: computed(() => status.value === "idle"),
    error,
    data,
    clear,
    refresh,
    invalidateCache: (...args: A) => globalCache.delete(generateCacheKey(args)),
  };
}

export function $useAction<T, A extends unknown[] = [], E = unknown>(
  fn: (...args: A) => Promise<T>,
  deps: WatchSource | WatchSource[] = () => [],
  opts: UseApiOptions = {},
) {
  return $useApi<T, A, E>(fn, deps, { ...opts, immediate: false });
}

export const api = { base };

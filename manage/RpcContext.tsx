
import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { DEFAULT_RPC_URL, RpcResponse } from './types';

interface RpcContextType {
    rpc: <T = any>(method: string, params?: any) => Promise<T>;
    rpcUrl: string;       // The full URL e.g. http://.../rpc
    rpcBaseUrl: string;   // The origin e.g. http://...
    availableUrls: string[];
    addUrl: (url: string) => void;
    removeUrl: (url: string) => void;
    updateUrl: (oldUrl: string, newUrl: string) => void;
    setCurrentUrl: (url: string) => void;
}

const RpcContext = createContext<RpcContextType | null>(null);

export const useRpc = () => {
    const context = useContext(RpcContext);
    if (!context) throw new Error("useRpc must be used within RpcProvider");
    return context;
};

export const RpcProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Initialize availableUrls from LocalStorage safely
    const [availableUrls, setAvailableUrls] = useState<string[]>(() => {
        try {
            const saved = localStorage.getItem('rpc_urls');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch (e) {
            console.warn("Failed to load rpc_urls", e);
        }
        return [DEFAULT_RPC_URL];
    });

    // Initialize currentUrl from LocalStorage
    const [currentUrl, setCurrentUrl] = useState<string>(() => {
        const saved = localStorage.getItem('active_rpc_url');
        // Check params override
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.has('rpc')) return params.get('rpc')!;
        }
        return saved || DEFAULT_RPC_URL;
    });

    // Persistence Effects
    useEffect(() => {
        localStorage.setItem('rpc_urls', JSON.stringify(availableUrls));
    }, [availableUrls]);

    useEffect(() => {
        localStorage.setItem('active_rpc_url', currentUrl);
    }, [currentUrl]);

    // Ensure currentUrl is valid within availableUrls (Cleanup logic)
    useEffect(() => {
        if (!availableUrls.includes(currentUrl)) {
            // If current URL was removed or is invalid, fallback to the first available or Default
            if (availableUrls.length > 0) {
                setCurrentUrl(availableUrls[0]);
            } else {
                setAvailableUrls([DEFAULT_RPC_URL]);
                setCurrentUrl(DEFAULT_RPC_URL);
            }
        }
    }, [availableUrls, currentUrl]);

    const addUrl = (url: string) => {
        if (url && !availableUrls.includes(url)) {
            setAvailableUrls(prev => [...prev, url]);
        }
    };

    const removeUrl = (url: string) => {
        const newUrls = availableUrls.filter(u => u !== url);
        // Ensure at least one URL exists
        if (newUrls.length === 0) newUrls.push(DEFAULT_RPC_URL);
        
        setAvailableUrls(newUrls);
        
        // If we removed the active URL, switch to the first available one
        if (currentUrl === url) {
            setCurrentUrl(newUrls[0]);
        }
    };

    const updateUrl = (oldUrl: string, newUrl: string) => {
        if (!newUrl) return;
        if (availableUrls.includes(newUrl) && newUrl !== oldUrl) {
            alert("This URL already exists in your list.");
            return;
        }
        setAvailableUrls(prev => prev.map(u => u === oldUrl ? newUrl : u));
        if (currentUrl === oldUrl) setCurrentUrl(newUrl);
    };

    const rpc = useCallback(async <T = any>(method: string, params: any = {}): Promise<T> => {
        let response;
        try {
            response = await fetch(currentUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ method, params }),
            });
        } catch (err: any) {
            // Handle network failures (server down, cors, etc)
            if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
                throw new Error(`Connection failed. Is the server running at ${currentUrl}?`);
            }
            throw err;
        }

        // Check content type to prevent "Unexpected token <" error when server returns HTML (e.g. 404)
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            await response.text(); // Consume body
            throw new Error(`Invalid Server Response (${response.status}). Expected JSON but got ${contentType}. Possible wrong RPC URL.`);
        }

        // Safe JSON parsing
        let data: RpcResponse<T>;
        try {
            data = await response.json();
        } catch (e) {
            throw new Error(`Failed to parse JSON response from ${currentUrl}.`);
        }

        if (!data.ok) throw new Error(data.error || 'Unknown RPC error');
        return data.result as T;
    }, [currentUrl]);

    // Derived base URL for screenshots
    const rpcBaseUrl = currentUrl.startsWith('http') 
        ? new URL(currentUrl).origin 
        : '';

    return (
        <RpcContext.Provider value={{ rpc, rpcUrl: currentUrl, rpcBaseUrl, availableUrls, addUrl, removeUrl, updateUrl, setCurrentUrl }}>
            {children}
        </RpcContext.Provider>
    );
};

'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

const PUBLIC_SETTINGS_KEYS = [
    'site_name',
    'site_tagline',
    'site_logo',
    'contact_email',
    'contact_phone',
    'contact_phone_secondary',
    'contact_whatsapp',
    'contact_address',
    'social_facebook',
    'social_instagram',
    'social_twitter',
    'social_tiktok',
    'social_snapchat',
    'social_youtube',
    'primary_color',
    'secondary_color',
    'currency',
    'currency_symbol',
] as const;

function settingValueToString(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return '';
}

interface SiteSettings {
    site_name: string;
    site_tagline: string;
    site_logo: string;
    contact_email: string;
    contact_phone: string;
    contact_whatsapp: string;
    contact_address: string;
    social_facebook: string;
    social_instagram: string;
    social_twitter: string;
    social_tiktok: string;
    social_snapchat: string;
    social_youtube: string;
    primary_color: string;
    secondary_color: string;
    currency: string;
    currency_symbol: string;
    [key: string]: string;
}

interface CMSContent {
    id: string;
    section: string;
    block_key: string;
    title: string | null;
    subtitle: string | null;
    content: string | null;
    image_url: string | null;
    button_text: string | null;
    button_url: string | null;
    metadata: Record<string, any>;
    is_active: boolean;
}

interface Banner {
    id: string;
    name: string;
    type: string;
    title: string | null;
    subtitle: string | null;
    image_url: string | null;
    background_color: string;
    text_color: string;
    button_text: string | null;
    button_url: string | null;
    is_active: boolean;
    position: string;
    start_date: string | null;
    end_date: string | null;
}

interface CMSContextType {
    settings: SiteSettings;
    content: CMSContent[];
    banners: Banner[];
    loading: boolean;
    getContent: (section: string, blockKey: string) => CMSContent | undefined;
    getSetting: (key: string) => string;
    getActiveBanners: (position?: string) => Banner[];
    refreshCMS: () => Promise<void>;
}

const defaultSettings: SiteSettings = {
    site_name: process.env.NEXT_PUBLIC_SITE_NAME || 'Sika Homes',
    site_tagline: process.env.NEXT_PUBLIC_SITE_TAGLINE || 'Furniture, sofas & interiors for beautiful homes in Ghana.',
    site_logo: '/logo.png',
    contact_email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@sikahomes.com',
    contact_phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '',
    contact_whatsapp: process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || process.env.NEXT_PUBLIC_CONTACT_PHONE || '',
    contact_address: process.env.NEXT_PUBLIC_CONTACT_ADDRESS || 'Ghana',
    social_facebook: '',
    social_instagram: '',
    social_twitter: '',
    social_tiktok: '',
    social_snapchat: '',
    social_youtube: '',
    primary_color: '#2563eb',
    secondary_color: '#64748b',
    currency: 'GHS',
    currency_symbol: 'GH₵',
};

const CMSContext = createContext<CMSContextType>({
    settings: defaultSettings,
    content: [],
    banners: [],
    loading: true,
    getContent: () => undefined,
    getSetting: () => '',
    getActiveBanners: () => [],
    refreshCMS: async () => { },
});

export function CMSProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
    const [content, setContent] = useState<CMSContent[]>([]);
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCMSData = useCallback(async () => {
        setLoading(true);
        try {
            const keys = PUBLIC_SETTINGS_KEYS.join(',');
            const res = await fetch(`/api/settings?keys=${encodeURIComponent(keys)}`);
            if (!res.ok) return;
            const data = (await res.json()) as { settings?: Record<string, unknown> };
            const raw = data.settings ?? {};
            setSettings((prev) => {
                const next = { ...prev };
                for (const key of PUBLIC_SETTINGS_KEYS) {
                    if (key in raw) {
                        next[key] = settingValueToString(raw[key]);
                    }
                }
                return next;
            });
        } catch (err) {
            console.warn('[CMS] settings fetch failed', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCMSData();
    }, [fetchCMSData]);

    const getContent = (section: string, blockKey: string): CMSContent | undefined => {
        return content.find(c => c.section === section && c.block_key === blockKey);
    };

    const getSetting = (key: string): string => {
        return settings[key] || defaultSettings[key] || '';
    };

    const getActiveBanners = (position?: string): Banner[] => {
        const now = new Date();
        return banners.filter(b => {
            if (position && b.position !== position) return false;
            if (b.start_date && new Date(b.start_date) > now) return false;
            if (b.end_date && new Date(b.end_date) < now) return false;
            return b.is_active;
        });
    };

    return (
        <CMSContext.Provider
            value={{
                settings,
                content,
                banners,
                loading,
                getContent,
                getSetting,
                getActiveBanners,
                refreshCMS: fetchCMSData,
            }}
        >
            {children}
        </CMSContext.Provider>
    );
}

export function useCMS() {
    const context = useContext(CMSContext);
    if (!context) {
        throw new Error('useCMS must be used within a CMSProvider');
    }
    return context;
}

export default CMSContext;

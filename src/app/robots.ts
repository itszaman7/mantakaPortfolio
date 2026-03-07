import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://mantaka.com'; // Replace with actual production URL if different

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/admin/', // Keeps admin panel private
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}

/** @type {import('next').NextConfig} */
const securityHeaders = [
    {
        key: "Content-Security-Policy",
        value: `
            default-src 'self';
            script-src 'self' 'unsafe-inline' 'unsafe-eval';
            style-src 'self' 'unsafe-inline' https://unpkg.com;
            img-src 'self' data: https://{s}.tile.openstreetmap.org https://res.cloudinary.com;
            connect-src 'self';
            font-src 'self';
        `.replace(/\n/g, ''), // Supprime les sauts de ligne pour éviter les erreurs
    },
    {
        key: "X-Frame-Options",
        value: "DENY",
    },
    {
        key: "X-Content-Type-Options",
        value: "nosniff",
    },
    {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
    },
    {
        key: "Permissions-Policy",
        value: "geolocation=(self), microphone=()",
    },
];

const nextConfig = {
    images: {
        domains: [
            'avatars.githubusercontent.com',
            'lh3.googleusercontent.com',
            'res.cloudinary.com',
        ],
    },
    async headers() {
        return [
            {
                source: "/(.*)", // Applique les en-têtes à toutes les routes
                headers: securityHeaders,
            },
        ];
    },
};

module.exports = nextConfig;
/**
 * Dedicated hero images for public section pages.
 * Detail pages use the matching section hero so titles stay on-brand
 * without relying on placeholder seed photos.
 */
export const pageHeroes = {
    home: '/images/home-hero.jpg',
    homeAbout: '/images/home-about.jpg',
    about: '/images/about-hero.jpg',
    contact: '/images/contact-hero.jpg',
    gallery: '/images/gallery-hero.jpg',
    programmes: '/images/programmes-hero.jpg',
    projects: '/images/projects-hero.jpg',
    events: '/images/events-hero.jpg',
    news: '/images/news-hero.jpg',
    getInvolved: '/images/get-involved-hero.jpg',
    volunteer: '/images/volunteer-hero.jpg',
    partner: '/images/partner-hero.jpg',
    donate: '/images/donate-hero.jpg',
} as const;

export type PageHeroKey = keyof typeof pageHeroes;

import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export const animatePageOut = (href: string, router: AppRouterInstance) => {
  const banners = [
    document.getElementById('banner-1'),
    document.getElementById('banner-2'),
    document.getElementById('banner-3'),
    document.getElementById('banner-4'),
  ];

  banners
    .filter((banner): banner is HTMLElement => banner !== null)
    .forEach((banner, index) => {
      banner.style.transition = `transform 1s ${index * 0.2}s`;
      banner.style.transform = 'translateY(-100%)';
    });

  setTimeout(
    () => {
      router.push(href);
    },
    1000 + banners.length * 200
  );
};

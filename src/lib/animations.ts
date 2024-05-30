import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export const animatePageOut = (href: string, router: AppRouterInstance) => {
  const banners = [
    document.getElementById('banner-1'),
    document.getElementById('banner-2'),
    document.getElementById('banner-3'),
    document.getElementById('banner-4'),
  ];

  banners
    .filter((banner) => banner !== null)
    .forEach((banner: HTMLElement, index) => {
      (banner as HTMLElement).style.transition = `transform 1s ${index * 0.2}s`;
      (banner as HTMLElement).style.transform = 'translateY(-100%)';
    });

  setTimeout(
    () => {
      router.push(href);
    },
    1000 + banners.filter((banner) => banner !== null).length * 200
  );
};

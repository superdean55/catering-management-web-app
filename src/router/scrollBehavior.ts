import type { RouteLocationNormalized, RouteLocationNormalizedLoaded, RouterScrollBehavior } from 'vue-router';

const scrollBehavior: RouterScrollBehavior = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalizedLoaded,
  savedPosition: { left: number; top: number } | null
) => {
    console.log('in scroll fun')
    console.log(to.hash)
    if (to.hash) {
        return {
          el: to.hash,
          behavior: 'smooth',
        }
    }
};

export default scrollBehavior;
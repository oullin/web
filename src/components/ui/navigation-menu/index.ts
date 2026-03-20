import { cva } from 'class-variance-authority';

export { default as NavigationMenu } from './NavMenu.vue';
export { default as NavigationMenuContent } from './NavCont.vue';
export { default as NavigationMenuIndicator } from './NavIndic.vue';
export { default as NavigationMenuItem } from './NavItem.vue';
export { default as NavigationMenuLink } from './NavLink.vue';
export { default as NavigationMenuList } from './NavList.vue';
export { default as NavigationMenuTrigger } from './NavTrig.vue';
export { default as NavigationMenuViewport } from './NavView.vue';

export const navigationMenuTriggerStyle = cva(
	'group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:hover:bg-accent data-[state=open]:text-accent-foreground data-[state=open]:focus:bg-accent data-[state=open]:bg-accent/50 focus-visible:ring-ring/50 outline-none transition-[color,box-shadow] focus-visible:ring-3 focus-visible:outline-1',
);

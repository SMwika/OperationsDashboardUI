declare module "*.svg" {
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module 'swiper/css' {}
declare module 'swiper/css/pagination' {}
declare module 'swiper/css/navigation' {}
declare module 'swiper/css/effect-creative' {}
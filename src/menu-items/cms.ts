// assets
import {
  Category,
  Document,
  Gallery,
  MessageText1,
  CallCalling,
  Setting2,
  Home2
} from '@wandersonalwes/iconsax-react';

// types
import { NavItemType } from 'types/menu';

// ==============================|| MENU ITEMS — CMS ||============================== //

const icons = {
  dashboard: Home2,
  services: Category,
  articles: Document,
  gallery: Gallery,
  testimonials: MessageText1,
  requests: CallCalling,
  settings: Setting2
};

const cms: NavItemType = {
  id: 'cms-group',
  title: 'إدارة المحتوى',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'الرئيسية',
      type: 'item',
      url: '/dashboard',
      icon: icons.dashboard,
      breadcrumbs: false
    },
    {
      id: 'services',
      title: 'الخدمات',
      type: 'item',
      url: '/dashboard/services',
      icon: icons.services
    },
    {
      id: 'articles',
      title: 'المقالات',
      type: 'item',
      url: '/dashboard/articles',
      icon: icons.articles
    },
    {
      id: 'gallery',
      title: 'معرض الصور',
      type: 'item',
      url: '/dashboard/gallery',
      icon: icons.gallery
    },
    {
      id: 'testimonials',
      title: 'آراء العملاء',
      type: 'item',
      url: '/dashboard/testimonials',
      icon: icons.testimonials
    },
    {
      id: 'requests',
      title: 'طلبات الخدمة',
      type: 'item',
      url: '/dashboard/requests',
      icon: icons.requests
    },
    {
      id: 'settings',
      title: 'الإعدادات',
      type: 'item',
      url: '/dashboard/settings',
      icon: icons.settings
    }
  ]
};

export default cms;

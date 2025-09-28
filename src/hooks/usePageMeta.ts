import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface PageMetaOptions {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  canonical?: string;
}

const defaultMeta = {
  title: 'EasySwitch - מחשבון חיסכון חכם',
  description: 'חסכו בחשבונות הבית עם המחשבון החכם שלנו. השוואת מחירים, ניתוח AI והמלצות מותאמות אישית.',
  keywords: ['חיסכון', 'חשמל', 'אינטרנט', 'סלולר', 'טלוויזיה', 'השוואת מחירים'],
  image: '/og-image.jpg'
};

const routeMeta: Record<string, PageMetaOptions> = {
  '/': {
    title: 'EasySwitch - דף הבית | מחשבון חיסכון חכם',
    description: 'המשפחה הממוצעת חוסכת ₪2,400 בשנה עם השירות שלנו. השוואת ספקים וחיסכון בחשבונות הבית.'
  },
  '/all-plans': {
    title: 'כל המסלולים | EasySwitch',
    description: 'מרכז המסלולים החכם - השוואה מבוססת AI, המלצות מותאמות אישית וכל המסלולים הטובים ביותר במקום אחד.'
  },
  '/analyze': {
    title: 'ניתוח חיסכון | EasySwitch',
    description: 'קבלו ניתוח מפורט של הוצאותיכם וגלו כמה אתם יכולים לחסוך עם המעבר לספקים חדשים.'
  },
  '/magazine': {
    title: 'מגזין | EasySwitch',
    description: 'מאמרים וטיפים לחיסכון בחשבונות הבית, עדכונים על השוק ומידע שימושי לצרכנים.'
  },
  '/tips': {
    title: 'טיפים | EasySwitch',
    description: 'טיפים מועילים לחיסכון בחשבונות הבית, איך לבחור ספק נכון ועוד.'
  },
  '/about': {
    title: 'אודות | EasySwitch',
    description: 'למדו עלינו ועל המשימה שלנו לעזור למשפחות ישראליות לחסוך בחשבונות הבית.'
  },
  '/contact': {
    title: 'צור קשר | EasySwitch',
    description: 'יש לכם שאלות? רוצים עזרה? צרו איתנו קשר ונשמח לעזור לכם לחסוך.'
  }
};

export const usePageMeta = (customMeta?: PageMetaOptions) => {
  const location = useLocation();

  useEffect(() => {
    const routeSpecificMeta = routeMeta[location.pathname] || {};
    const finalMeta = { ...defaultMeta, ...routeSpecificMeta, ...customMeta };

    // Update document title
    document.title = finalMeta.title || defaultMeta.title;

    // Update meta description
    updateMetaTag('description', finalMeta.description || defaultMeta.description);

    // Update meta keywords
    if (finalMeta.keywords) {
      updateMetaTag('keywords', finalMeta.keywords.join(', '));
    }

    // Update Open Graph tags
    updateMetaTag('og:title', finalMeta.title || defaultMeta.title, 'property');
    updateMetaTag('og:description', finalMeta.description || defaultMeta.description, 'property');
    updateMetaTag('og:image', finalMeta.image || defaultMeta.image, 'property');
    updateMetaTag('og:url', window.location.href, 'property');
    updateMetaTag('og:type', 'website', 'property');

    // Update Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', finalMeta.title || defaultMeta.title);
    updateMetaTag('twitter:description', finalMeta.description || defaultMeta.description);
    updateMetaTag('twitter:image', finalMeta.image || defaultMeta.image);

    // Update canonical URL
    updateCanonicalLink(finalMeta.canonical || window.location.href);

  }, [location.pathname, customMeta]);
};

function updateMetaTag(name: string, content: string, attribute: string = 'name') {
  let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  
  element.setAttribute('content', content);
}

function updateCanonicalLink(href: string) {
  let element = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  
  element.setAttribute('href', href);
}
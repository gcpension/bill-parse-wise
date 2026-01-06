import { Helmet } from 'react-helmet-async';

interface WebsiteSchemaProps {
  name?: string;
  url?: string;
  description?: string;
}

interface FAQSchemaProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

interface ProductSchemaProps {
  name: string;
  description: string;
  price: number;
  currency?: string;
  provider: string;
  category: string;
  rating?: number;
  reviewCount?: number;
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export const WebsiteSchema = ({ 
  name = 'חסכונט - השוואת ספקים',
  url = 'https://easyswitch.co.il',
  description = 'מערכת השוואת ספקי חשמל, סלולר ואינטרנט לחיסכון מקסימלי'
}: WebsiteSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": name,
    "url": url,
    "description": description,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${url}/all-plans?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export const OrganizationSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "חסכונט",
    "alternateName": "EasySwitch",
    "url": "https://easyswitch.co.il",
    "logo": "https://easyswitch.co.il/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+972-3-1234567",
      "contactType": "customer service",
      "availableLanguage": ["Hebrew", "English"]
    },
    "sameAs": [
      "https://facebook.com/easyswitch",
      "https://instagram.com/easyswitch"
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export const FAQSchema = ({ faqs }: FAQSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export const ProductSchema = ({
  name,
  description,
  price,
  currency = 'ILS',
  provider,
  category,
  rating,
  reviewCount
}: ProductSchemaProps) => {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": description,
    "brand": {
      "@type": "Brand",
      "name": provider
    },
    "category": category,
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": currency,
      "availability": "https://schema.org/InStock"
    }
  };

  if (rating && reviewCount) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": rating,
      "reviewCount": reviewCount,
      "bestRating": "5",
      "worstRating": "1"
    };
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export const BreadcrumbSchema = ({ items }: BreadcrumbSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export const LocalBusinessSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "חסכונט",
    "@id": "https://easyswitch.co.il",
    "url": "https://easyswitch.co.il",
    "telephone": "+972-3-1234567",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IL",
      "addressRegion": "Tel Aviv"
    },
    "priceRange": "Free",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

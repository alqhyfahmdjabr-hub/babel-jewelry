import { ContactInfo, Product, GoldPrice, Pattern } from './types';

export const APP_NAME = "مجوهرات بابل";

export const BACKGROUND_LOGO_URL = "https://i.postimg.cc/25Knz1yL/babl3.png"; // Updated Babel logo

export const PATTERNS: Pattern[] = [
  { id: 'arabesque', name: 'زخرفة عربية', url: 'https://www.transparenttextures.com/patterns/arabesque.png' },
  { id: 'scales', name: 'حراشف التنين', url: 'https://www.transparenttextures.com/patterns/black-scales.png' },
  { id: 'diamond', name: 'تنجيد فاخر', url: 'https://www.transparenttextures.com/patterns/black-thread.png' },
  { id: 'leather', name: 'جلد أسود', url: 'https://www.transparenttextures.com/patterns/black-leather.png' },
  { id: 'carbon', name: 'كاربون فايبر', url: 'https://www.transparenttextures.com/patterns/carbon-fibre.png' },
  { id: 'wood', name: 'خشب محروق', url: 'https://www.transparenttextures.com/patterns/purty-wood.png' },
];

// Using picsum as requested, but with seeds to keep them consistent
export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'طقم ملكي فاخر',
    category: 'set',
    weight: 45.5,
    priceEstimate: 4500000,
    imageUrl: 'https://picsum.photos/id/1/600/600', 
    description: 'طقم ذهب عيار 21 بتصميم بحريني تراثي فاخر، يتكون من عقد وسوار وقرطين وخاتم.',
    karat: 21
  },
  {
    id: '2',
    name: 'خاتم السلطانة',
    category: 'ring',
    weight: 8.2,
    priceEstimate: 850000,
    imageUrl: 'https://picsum.photos/id/2/600/600',
    description: 'خاتم عيار 21 مرصع بفصوص الزركون السويسري، تصميم عصري وجذاب.',
    karat: 21
  },
  {
    id: '3',
    name: 'سوار الحب الأبدي',
    category: 'bracelet',
    weight: 15.5,
    priceEstimate: 1600000,
    imageUrl: 'https://picsum.photos/id/3/600/600',
    description: 'سوار عيار 18 بتصميم إيطالي ناعم، مثالي للإهداء.',
    karat: 18
  },
  {
    id: '4',
    name: 'عقد اللؤلؤ الذهبي',
    category: 'necklace',
    weight: 22.0,
    priceEstimate: 2300000,
    imageUrl: 'https://picsum.photos/id/4/600/600',
    description: 'عقد ذهب عيار 21 ممزوج بحبات اللؤلؤ الصناعي عالي الجودة.',
    karat: 21
  },
  {
    id: '5',
    name: 'حلق الاميرة',
    category: 'earring',
    weight: 4.5,
    priceEstimate: 480000,
    imageUrl: 'https://picsum.photos/id/5/600/600',
    description: 'حلق خفيف عيار 21 مناسب للاستخدام اليومي بتصميم ورقة الشجر.',
    karat: 21
  },
  {
    id: '6',
    name: 'سبيكة بابل الخاصة',
    category: 'set',
    weight: 31.1,
    priceEstimate: 3500000,
    imageUrl: 'https://picsum.photos/id/6/600/600',
    description: 'أونصة ذهب عيار 24 صافي للاستثمار والادخار.',
    karat: 24
  }
];

export const MOCK_PRICES: GoldPrice[] = [
  { karat: 24, buy: 34500, sell: 35000 },
  { karat: 21, buy: 30200, sell: 30800 },
  { karat: 18, buy: 25800, sell: 26500 },
];

export const CONTACT_INFO: ContactInfo = {
  manager: '777772879',
  workers: ['774198414', '774386432'],
  landlines: ['02451445', '02451944'],
  designer: {
    name: 'احمد جابر',
    phone: '783447222'
  }
};

export const QURAN_VERSE = "يَا أَيُّهَا الَّذِينَ آمَنُوا لَا تَأْكُلُوا أَمْوَالَكُم بَيْنَكُم بِالْبَاطِلِ إِلَّا أَن تَكُونَ تِجَارَةً عَن تَرَاضٍ مِّنكُمْ";

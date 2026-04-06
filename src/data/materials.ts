import type { Material } from '@/types'

export const materials: Material[] = [
  {
    id: 'm1', slug: 'roble-natural', category: 'maderas',
    title: { es: 'Roble Natural', en: 'Natural Oak', ru: 'Натуральный дуб' },
    description: { es: 'El roble natural es nuestra madera estrella. Cálido, duradero y con una veta que cuenta su propia historia.', en: 'Natural oak is our star wood. Warm, durable and with a grain that tells its own story.', ru: 'Натуральный дуб — наше главное дерево. Тёплое, долговечное, с текстурой, которая рассказывает свою историю.' },
    characteristics: { es: ['Alta durabilidad (50+ años)', 'Resistente a la humedad', 'Veta natural única', 'Fácil de reparar', 'Sostenible y certificado FSC'], en: ['High durability (50+ years)', 'Moisture resistant', 'Unique natural grain', 'Easy to repair', 'Sustainable and FSC certified'], ru: ['Высокая долговечность (50+ лет)', 'Устойчивость к влаге', 'Уникальная натуральная текстура', 'Легко ремонтируется', 'Сертификат FSC'] },
    mainImage: { src: 'https://images.unsplash.com/photo-1530973428-5bf2db2e4d71?w=1200&q=80', alt: { es: 'Roble natural', en: 'Natural oak', ru: 'Натуральный дуб' }, width: 1200, height: 800 },
    textureImage: { src: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=800&q=80', alt: { es: 'Textura de roble', en: 'Oak texture', ru: 'Текстура дуба' }, width: 800, height: 800 },
    gallery: [], projectIds: ['p1', 'p4'],
  },
  {
    id: 'm2', slug: 'nogal-americano', category: 'maderas',
    title: { es: 'Nogal Americano', en: 'American Walnut', ru: 'Американский орех' },
    description: { es: 'El nogal americano aporta elegancia oscura y sofisticada. Ideal para vestidores, muebles de representación y elementos de acento.', en: 'American walnut brings dark, sophisticated elegance. Ideal for wardrobes, statement furniture and accent elements.', ru: 'Американский орех привносит тёмную изысканную элегантность. Идеален для гардеробных и акцентных элементов.' },
    characteristics: { es: ['Tono oscuro y cálido', 'Muy alta densidad', 'Acabado natural brillante', 'Premium y exclusivo'], en: ['Dark and warm tone', 'Very high density', 'Natural brilliant finish', 'Premium and exclusive'], ru: ['Тёмный тёплый тон', 'Очень высокая плотность', 'Натуральный блестящий финиш', 'Премиум и эксклюзив'] },
    mainImage: { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80', alt: { es: 'Nogal americano', en: 'American walnut', ru: 'Американский орех' }, width: 1200, height: 800 },
    textureImage: { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', alt: { es: 'Textura de nogal', en: 'Walnut texture', ru: 'Текстура ореха' }, width: 800, height: 800 },
    gallery: [], projectIds: ['p2', 'p4'],
  },
  {
    id: 'm3', slug: 'acero-inoxidable', category: 'metales',
    title: { es: 'Acero Inoxidable', en: 'Stainless Steel', ru: 'Нержавеющая сталь' },
    description: { es: 'Acero inoxidable de grado 316 con acabado cepillado o espejo. Higiene total y estética industrial que complementa perfectamente la madera.', en: 'Grade 316 stainless steel with brushed or mirror finish. Total hygiene and industrial aesthetic that perfectly complements wood.', ru: 'Нержавеющая сталь марки 316 с матированной или зеркальной отделкой. Прекрасно дополняет дерево.' },
    characteristics: { es: ['Higiene alimentaria certificada', 'Resistente a la corrosión', 'Fácil limpieza', 'Durabilidad ilimitada'], en: ['Certified food hygiene', 'Corrosion resistant', 'Easy to clean', 'Unlimited durability'], ru: ['Сертифицированная пищевая гигиена', 'Устойчивость к коррозии', 'Легко чистить', 'Неограниченная долговечность'] },
    mainImage: { src: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1200&q=80', alt: { es: 'Acero inoxidable', en: 'Stainless steel', ru: 'Нержавеющая сталь' }, width: 1200, height: 800 },
    textureImage: { src: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80', alt: { es: 'Textura acero', en: 'Steel texture', ru: 'Текстура стали' }, width: 800, height: 800 },
    gallery: [], projectIds: ['p1', 'p3', 'p5'],
  },
  {
    id: 'm4', slug: 'terciopelo-gris', category: 'textiles',
    title: { es: 'Terciopelo Gris Perla', en: 'Pearl Grey Velvet', ru: 'Бархат жемчужно-серый' },
    description: { es: 'Terciopelo de alta resistencia al uso. Suave al tacto, con un brillo sutil que añade lujo discreto a cualquier espacio.', en: 'High wear-resistance velvet. Soft to the touch, with a subtle shine that adds discreet luxury to any space.', ru: 'Высокопрочный бархат. Мягкий на ощупь, с тонким блеском, который добавляет сдержанную роскошь любому пространству.' },
    characteristics: { es: ['Alta resistencia al desgaste', 'Fácil limpieza', 'Color estable UV', 'Ignífugo Clase 1'], en: ['High wear resistance', 'Easy to clean', 'UV stable colour', 'Class 1 fire retardant'], ru: ['Высокая износостойкость', 'Легко чистить', 'Стабильный UV-цвет', 'Огнезащита класс 1'] },
    mainImage: { src: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&q=80', alt: { es: 'Terciopelo gris', en: 'Grey velvet', ru: 'Серый бархат' }, width: 1200, height: 800 },
    textureImage: { src: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80', alt: { es: 'Textura terciopelo', en: 'Velvet texture', ru: 'Текстура бархата' }, width: 800, height: 800 },
    gallery: [], projectIds: ['p2'],
  },
]

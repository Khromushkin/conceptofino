import type { Material } from '@/types'

export const materials: Material[] = [
  {
    id: 'm1', slug: 'roble-natural', category: 'maderas',
    title: { es: 'Roble Natural', en: 'Natural Oak', ru: 'Натуральный дуб' },
    description: { es: 'El roble natural es nuestra madera estrella. Cálido, duradero y con una veta que cuenta su propia historia.', en: 'Natural oak is our star wood. Warm, durable and with a grain that tells its own story.', ru: 'Натуральный дуб — наше главное дерево. Тёплое, долговечное, с текстурой, которая рассказывает свою историю.' },
    characteristics: { es: ['Alta durabilidad (50+ años)', 'Resistente a la humedad', 'Veta natural única', 'Fácil de reparar', 'Sostenible y certificado FSC'], en: ['High durability (50+ years)', 'Moisture resistant', 'Unique natural grain', 'Easy to repair', 'Sustainable and FSC certified'], ru: ['Высокая долговечность (50+ лет)', 'Устойчивость к влаге', 'Уникальная натуральная текстура', 'Легко ремонтируется', 'Сертификат FSC'] },
    mainImage: { src: '/images/projects/paneles_de_pared_y_techo_de_madera/0-lg.webp', alt: { es: 'Roble natural', en: 'Natural oak', ru: 'Натуральный дуб' }, width: 1080, height: 1080 },
    textureImage: { src: '/images/projects/paneles_de_pared_y_techo_de_madera/3-lg.webp', alt: { es: 'Textura de roble', en: 'Oak texture', ru: 'Текстура дуба' }, width: 1080, height: 1080 },
    gallery: [], projectIds: ['p1', 'p4', 'p5'],
  },
  {
    id: 'm2', slug: 'nogal-americano', category: 'maderas',
    title: { es: 'Nogal Americano', en: 'American Walnut', ru: 'Американский орех' },
    description: { es: 'El nogal americano aporta elegancia oscura y sofisticada. Ideal para vestidores, muebles de representación y elementos de acento.', en: 'American walnut brings dark, sophisticated elegance. Ideal for wardrobes, statement furniture and accent elements.', ru: 'Американский орех привносит тёмную изысканную элегантность. Идеален для гардеробных и акцентных элементов.' },
    characteristics: { es: ['Tono oscuro y cálido', 'Muy alta densidad', 'Acabado natural brillante', 'Premium y exclusivo'], en: ['Dark and warm tone', 'Very high density', 'Natural brilliant finish', 'Premium and exclusive'], ru: ['Тёмный тёплый тон', 'Очень высокая плотность', 'Натуральный блестящий финиш', 'Премиум и эксклюзив'] },
    mainImage: { src: '/images/projects/tabiques_techos_decoracion_listones_madera/0-lg.webp', alt: { es: 'Nogal americano', en: 'American walnut', ru: 'Американский орех' }, width: 1080, height: 1080 },
    textureImage: { src: '/images/projects/tabiques_techos_decoracion_listones_madera/2-lg.webp', alt: { es: 'Textura de nogal', en: 'Walnut texture', ru: 'Текстура ореха' }, width: 1080, height: 1080 },
    gallery: [], projectIds: ['p2', 'p4'],
  },
  {
    id: 'm3', slug: 'acero-inoxidable', category: 'metales',
    title: { es: 'Acero Inoxidable', en: 'Stainless Steel', ru: 'Нержавеющая сталь' },
    description: { es: 'Acero inoxidable de grado 316 con acabado cepillado o espejo. Higiene total y estética industrial que complementa perfectamente la madera.', en: 'Grade 316 stainless steel with brushed or mirror finish. Total hygiene and industrial aesthetic that perfectly complements wood.', ru: 'Нержавеющая сталь марки 316 с матированной или зеркальной отделкой. Прекрасно дополняет дерево.' },
    characteristics: { es: ['Higiene alimentaria certificada', 'Resistente a la corrosión', 'Fácil limpieza', 'Durabilidad ilimitada'], en: ['Certified food hygiene', 'Corrosion resistant', 'Easy to clean', 'Unlimited durability'], ru: ['Сертифицированная пищевая гигиена', 'Устойчивость к коррозии', 'Легко чистить', 'Неограниченная долговечность'] },
    mainImage: { src: '/images/projects/cocinas/2-lg.webp', alt: { es: 'Acero inoxidable en cocina', en: 'Stainless steel in kitchen', ru: 'Нержавеющая сталь на кухне' }, width: 1080, height: 1080 },
    textureImage: { src: '/images/projects/cocinas/5-lg.webp', alt: { es: 'Detalle acero cocina', en: 'Kitchen steel detail', ru: 'Деталь стали кухни' }, width: 1080, height: 1080 },
    gallery: [], projectIds: ['p1', 'p3', 'p5'],
  },
  {
    id: 'm5', slug: 'piedra-natural', category: 'piedra',
    title: { es: 'Piedra Natural', en: 'Natural Stone', ru: 'Натуральный камень' },
    description: { es: 'Trabajamos tres tipos de mármol: negro con vetas doradas para un impacto máximo, blanco-gris con dibujo vivo para ambientes luminosos, y verde oscuro de gran carácter. Cada bloque es irrepetible — no hay dos lavabos iguales.', en: 'We work with three marble types: black with golden veining for maximum impact, white-grey with vivid pattern for bright spaces, and dark green of great character. Each block is unique — no two sinks are alike.', ru: 'Работаем с тремя типами мрамора: чёрным с золотыми прожилками для максимального эффекта, бело-серым с живым рисунком для светлых пространств и тёмно-зелёным с характером. Каждый блок уникален — двух одинаковых раковин не бывает.' },
    characteristics: { es: ['Mármol macizo 100% natural', 'Tres acabados disponibles: negro, blanco y verde', 'Resistente al agua, calor y abrasión', 'Cada pieza es irrepetible', 'Valor añadido permanente al inmueble'], en: ['100% natural solid marble', 'Three finishes available: black, white and green', 'Resistant to water, heat and abrasion', 'Each piece is unrepeatable', 'Permanent added value to the property'], ru: ['Сплошной мрамор 100% натуральный', 'Три варианта: чёрный, белый, зелёный', 'Устойчив к воде, жару и царапинам', 'Каждая деталь неповторима', 'Постоянная прибавка к стоимости жилья'] },
    mainImage: { src: '/images/projects/lavabos/0-lg.webp', alt: { es: 'Lavabo de mármol negro con vetas doradas', en: 'Black marble sink with golden veins', ru: 'Раковина из чёрного мрамора с золотыми прожилками' }, width: 1080, height: 1080 },
    textureImage: { src: '/images/projects/lavabos/3-lg.webp', alt: { es: 'Mármol verde oscuro', en: 'Dark green marble', ru: 'Тёмно-зелёный мрамор' }, width: 1080, height: 1080 },
    gallery: [
      { src: '/images/projects/lavabos/1-lg.webp', alt: { es: 'Lavabo de mármol blanco-gris', en: 'White-grey marble sink', ru: 'Раковина из бело-серого мрамора' }, width: 1080, height: 1080 },
      { src: '/images/projects/lavabos/2-lg.webp', alt: { es: 'Mármol blanco-gris, vista completa', en: 'White-grey marble, full view', ru: 'Бело-серый мрамор, общий вид' }, width: 1080, height: 1080 },
      { src: '/images/projects/lavabos/4-lg.webp', alt: { es: 'Lavabo de mármol verde oscuro', en: 'Dark green marble sink', ru: 'Раковина из тёмно-зелёного мрамора' }, width: 1080, height: 1080 },
    ], projectIds: ['p6'],
  },
  {
    id: 'm4', slug: 'terciopelo-gris', category: 'textiles',
    title: { es: 'Terciopelo Gris Perla', en: 'Pearl Grey Velvet', ru: 'Бархат жемчужно-серый' },
    description: { es: 'Terciopelo de alta resistencia al uso. Suave al tacto, con un brillo sutil que añade lujo discreto a cualquier espacio.', en: 'High wear-resistance velvet. Soft to the touch, with a subtle shine that adds discreet luxury to any space.', ru: 'Высокопрочный бархат. Мягкий на ощупь, с тонким блеском, который добавляет сдержанную роскошь любому пространству.' },
    characteristics: { es: ['Alta resistencia al desgaste', 'Fácil limpieza', 'Color estable UV', 'Ignífugo Clase 1'], en: ['High wear resistance', 'Easy to clean', 'UV stable colour', 'Class 1 fire retardant'], ru: ['Высокая износостойкость', 'Легко чистить', 'Стабильный UV-цвет', 'Огнезащита класс 1'] },
    mainImage: { src: '/images/projects/vestidores/2-lg.webp', alt: { es: 'Terciopelo gris en vestidor', en: 'Grey velvet in wardrobe', ru: 'Серый бархат в гардеробной' }, width: 1080, height: 1080 },
    textureImage: { src: '/images/projects/vestidores/5-lg.webp', alt: { es: 'Detalle terciopelo', en: 'Velvet detail', ru: 'Деталь бархата' }, width: 1080, height: 1080 },
    gallery: [], projectIds: ['p2'],
  },
]

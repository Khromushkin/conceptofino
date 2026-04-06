import type { Service } from '@/types'

export const services: Service[] = [
  {
    id: 's1', slug: 'diseno',
    title: { es: 'Diseño de Interiores', en: 'Interior Design', ru: 'Дизайн интерьера' },
    description: { es: 'Comenzamos con escucha activa. Visitamos tu espacio, tomamos medidas exactas y elaboramos un proyecto 3D completo con opciones de materiales y acabados.', en: 'We start with active listening. We visit your space, take exact measurements and produce a complete 3D project with material and finish options.', ru: 'Начинаем с активного слушания. Посещаем ваше пространство, снимаем точные мерки и разрабатываем полный 3D-проект с вариантами материалов и отделки.' },
    steps: [
      { title: { es: 'Primera visita', en: 'First visit', ru: 'Первый визит' }, description: { es: 'Visita gratuita a tu domicilio. Tomamos medidas, fotografías y entendemos tus necesidades y presupuesto.', en: 'Free home visit. We take measurements, photos and understand your needs and budget.', ru: 'Бесплатный визит на дом. Снимаем мерки, делаем фотографии, понимаем ваши потребности и бюджет.' }, icon: 'Home', imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80' },
      { title: { es: 'Diseño 3D', en: '3D Design', ru: '3D дизайн' }, description: { es: 'Presentamos un render 3D fotorrealista de tu espacio con todas las opciones de materiales y configuraciones.', en: 'We present a photorealistic 3D render of your space with all material and configuration options.', ru: 'Представляем фотореалистичный 3D-рендер вашего пространства.' }, icon: 'Layers', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80' },
      { title: { es: 'Presupuesto detallado', en: 'Detailed quote', ru: 'Детальная смета' }, description: { es: 'Presupuesto sin letra pequeña: materiales, mano de obra, instalación y garantías. Todo incluido.', en: 'Quote with no small print: materials, labour, installation and warranties. All inclusive.', ru: 'Смета без мелкого шрифта: материалы, труд, монтаж и гарантии. Всё включено.' }, icon: 'FileText', imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80' },
    ],
    mainImage: { src: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1400&q=80', alt: { es: 'Diseño de interiores', en: 'Interior design', ru: 'Дизайн интерьера' }, width: 1400, height: 933 },
  },
  {
    id: 's2', slug: 'fabricacion',
    title: { es: 'Fabricación Propia', en: 'Own Manufacturing', ru: 'Собственное производство' },
    description: { es: 'Nuestro taller en Valencia fabrica cada pieza a medida. Sin intermediarios, sin catálogos: tus muebles nacen en nuestras manos.', en: 'Our Valencia workshop manufactures each piece to measure. No middlemen, no catalogues: your furniture is born in our hands.', ru: 'Наша мастерская в Валенсии изготавливает каждую деталь на заказ. Без посредников, без каталогов: ваша мебель рождается в наших руках.' },
    steps: [
      { title: { es: 'Selección de materiales', en: 'Material selection', ru: 'Выбор материалов' }, description: { es: 'Seleccionamos los materiales según el proyecto. Solo trabajamos con proveedores de primer nivel y materiales certificados.', en: 'We select materials according to the project. We only work with first-tier suppliers and certified materials.', ru: 'Выбираем материалы согласно проекту. Работаем только с поставщиками первого уровня и сертифицированными материалами.' }, icon: 'Package', imageUrl: 'https://images.unsplash.com/photo-1530973428-5bf2db2e4d71?w=800&q=80' },
      { title: { es: 'Fabricación en taller', en: 'Workshop manufacturing', ru: 'Изготовление в мастерской' }, description: { es: 'Cada pieza se fabrica en nuestro taller de Valencia con maquinaria de precisión CNC y acabados manuales.', en: 'Each piece is manufactured in our Valencia workshop with CNC precision machinery and manual finishes.', ru: 'Каждая деталь изготавливается в нашей мастерской с высокоточным CNC-оборудованием и ручной отделкой.' }, icon: 'Wrench', imageUrl: 'https://images.unsplash.com/photo-1609220136736-443140cfeaa8?w=800&q=80' },
      { title: { es: 'Control de calidad', en: 'Quality control', ru: 'Контроль качества' }, description: { es: 'Revisión exhaustiva antes de la entrega. Cada cajón, bisagra y acabado se prueba en taller.', en: 'Thorough review before delivery. Every drawer, hinge and finish is tested in the workshop.', ru: 'Тщательная проверка перед доставкой. Каждый ящик, петля и отделка тестируются в мастерской.' }, icon: 'CheckCircle', imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80' },
    ],
    mainImage: { src: 'https://images.unsplash.com/photo-1609220136736-443140cfeaa8?w=1400&q=80', alt: { es: 'Fabricación propia', en: 'Own manufacturing', ru: 'Собственное производство' }, width: 1400, height: 933 },
  },
  {
    id: 's3', slug: 'montaje',
    title: { es: 'Montaje y Logística', en: 'Assembly & Logistics', ru: 'Монтаж и логистика' },
    description: { es: 'Nuestro equipo de montadores profesionales instala tu proyecto en 1-3 días. Cero estrés para ti: nos encargamos de todo.', en: 'Our team of professional assemblers installs your project in 1-3 days. Zero stress for you: we take care of everything.', ru: 'Наша команда профессиональных монтажников устанавливает ваш проект за 1-3 дня. Нулевой стресс для вас: мы обо всём заботимся.' },
    steps: [
      { title: { es: 'Coordinación', en: 'Coordination', ru: 'Координация' }, description: { es: 'Acordamos fecha y hora de instalación que mejor te convenga. Sin improvisar, sin retrasos.', en: 'We agree on the installation date and time that suits you best. No improvisation, no delays.', ru: 'Согласовываем дату и время монтажа, которые вам лучше всего подходят. Без импровизации, без задержек.' }, icon: 'Calendar', imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80' },
      { title: { es: 'Instalación profesional', en: 'Professional installation', ru: 'Профессиональная установка' }, description: { es: 'Nuestros instaladores cuidan cada detalle: protegen suelos, limpian al terminar y dejan tu casa perfecta.', en: 'Our installers take care of every detail: protect floors, clean up afterwards and leave your home perfect.', ru: 'Наши монтажники заботятся о каждой детали: защищают полы, убирают после себя и оставляют ваш дом идеальным.' }, icon: 'Wrench', imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80' },
      { title: { es: 'Garantía 5 años', en: '5-year warranty', ru: 'Гарантия 5 лет' }, description: { es: 'Todos nuestros proyectos incluyen 5 años de garantía. Cualquier incidencia, la resolvemos sin coste.', en: 'All our projects include a 5-year warranty. Any issue, we resolve it at no cost.', ru: 'Все наши проекты включают 5-летнюю гарантию. Любую проблему решаем бесплатно.' }, icon: 'Shield', imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80' },
    ],
    mainImage: { src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1400&q=80', alt: { es: 'Montaje profesional', en: 'Professional assembly', ru: 'Профессиональный монтаж' }, width: 1400, height: 933 },
  },
]

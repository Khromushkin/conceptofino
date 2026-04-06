import type { Review } from '@/types'

export const reviews: Review[] = [
  {
    id: 'r1', clientName: 'Sofía R.',
    clientRole: { es: 'Propietaria de villa en Campanar', en: 'Villa owner in Campanar', ru: 'Владелица виллы в Кампанаре' },
    text: { es: 'Increíble resultado. Pensaba que tener muebles a medida era solo para gente con mucho dinero, pero ConceptoFino me demostró que con el mismo presupuesto que tenía previsto para IKEA, pude tener exactamente lo que quería. El vestidor es perfecto.', en: 'Incredible result. I thought custom furniture was only for people with a lot of money, but ConceptoFino showed me that with the same budget I had planned for IKEA, I could have exactly what I wanted. The wardrobe is perfect.', ru: 'Невероятный результат. Я думала, что мебель на заказ — только для состоятельных людей, но ConceptoFino доказал мне, что с тем же бюджетом, который я планировала потратить в IKEA, я могла получить именно то, что хотела. Гардеробная идеальна.' },
    rating: 5, projectId: 'p2',
  },
  {
    id: 'r2', clientName: 'Andrés M.',
    clientRole: { es: 'Arquitecto, Valencia', en: 'Architect, Valencia', ru: 'Архитектор, Валенсия' },
    text: { es: 'Como arquitecto soy muy exigente con los detalles. ConceptoFino cumplió cada especificación al milímetro. La cocina que diseñaron para mi cliente en Ruzafa es una obra maestra. Repetiré sin duda.', en: 'As an architect I am very demanding about details. ConceptoFino met every specification to the millimetre. The kitchen they designed for my client in Ruzafa is a masterpiece. I will definitely repeat.', ru: 'Как архитектор я очень требователен к деталям. ConceptoFino выполнил каждую спецификацию с точностью до миллиметра. Кухня, которую они спроектировали для моего клиента в Русафе, — это шедевр. Обязательно повторю.' },
    rating: 5, projectId: 'p4',
  },
  {
    id: 'r3', clientName: 'Elena V.',
    clientRole: { es: 'Inversora inmobiliaria', en: 'Property investor', ru: 'Инвестор в недвижимость' },
    text: { es: 'Trabajo con ConceptoFino en todos mis proyectos de renovación. Los tiempos son impecables — siempre en 3 semanas — y la calidad-precio es insuperable. Mis inquilinos siempre mencionan los muebles.', en: 'I work with ConceptoFino on all my renovation projects. Timelines are impeccable — always 3 weeks — and the value for money is unbeatable. My tenants always mention the furniture.', ru: 'Работаю с ConceptoFino во всех своих проектах реновации. Сроки безупречные — всегда 3 недели — и соотношение цена-качество непревзойдённое. Мои арендаторы всегда упоминают мебель.' },
    rating: 5, projectId: 'p1',
  },
  {
    id: 'r4', clientName: 'Pablo C.',
    clientRole: { es: 'Propietario de piso en Eixample', en: 'Apartment owner in Eixample', ru: 'Владелец квартиры в Эйшампле' },
    text: { es: 'Dudé mucho antes de contactarles porque pensaba que sería carísimo. Me sorprendió el presupuesto — era competitivo con las tiendas grandes — y el resultado es infinitamente mejor. Ojalá lo hubiera hecho antes.', en: 'I hesitated a lot before contacting them because I thought it would be very expensive. I was surprised by the quote — it was competitive with the big stores — and the result is infinitely better. I wish I had done it sooner.', ru: 'Я долго колебался, прежде чем связаться с ними, потому что думал, что это будет очень дорого. Смета меня удивила — она была конкурентоспособна с крупными магазинами — а результат бесконечно лучше. Жаль, что не сделал это раньше.' },
    rating: 5, projectId: 'p3',
  },
]

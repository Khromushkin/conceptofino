import type { TeamMember } from '@/types'

export const team: TeamMember[] = [
  {
    id: 't1', name: 'Carlos Martínez',
    role: { es: 'Fundador & Director de Diseño', en: 'Founder & Design Director', ru: 'Основатель и арт-директор' },
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    bio: { es: '15 años transformando espacios en Valencia. Arquitecto de formación, apasionado por la intersección entre funcionalidad y belleza atemporal.', en: '15 years transforming spaces in Valencia. Architect by training, passionate about the intersection of functionality and timeless beauty.', ru: '15 лет трансформирует пространства в Валенсии. Архитектор по образованию, увлечённый пересечением функциональности и вневременной красоты.' },
    order: 1,
  },
  {
    id: 't2', name: 'Ana Gómez',
    role: { es: 'Jefa de Taller & Fabricación', en: 'Workshop Manager & Manufacturing', ru: 'Руководитель мастерской и производства' },
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    bio: { es: 'Maestra artesana con 20 años de experiencia. Supervisa cada pieza que sale de nuestro taller en Valencia.', en: 'Master craftsperson with 20 years of experience. Supervises every piece that leaves our Valencia workshop.', ru: 'Мастер-ремесленник с 20-летним опытом. Контролирует каждую деталь, выходящую из нашей мастерской в Валенсии.' },
    order: 2,
  },
  {
    id: 't3', name: 'Miguel Torres',
    role: { es: 'Diseñador de Interiores Senior', en: 'Senior Interior Designer', ru: 'Старший дизайнер интерьеров' },
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    bio: { es: 'Especializado en proyectos residenciales de alta gama. Ha colaborado con estudios de interiorismo en Madrid, Barcelona y Valencia.', en: 'Specialised in high-end residential projects. Has collaborated with interior design studios in Madrid, Barcelona and Valencia.', ru: 'Специализируется на высококлассных жилых проектах. Сотрудничал со студиями дизайна интерьеров в Мадриде, Барселоне и Валенсии.' },
    order: 3,
  },
]


import type { SlideContent } from '../types';

export const PRESENTATION_SLIDES: SlideContent[] = [
  {
    type: 'content',
    title: 'Welcome to Interactive Learning!',
    content: [
      'This is a demonstration of an interactive presentation.',
      'Professors can control the slides, and students follow along.',
      'Get ready to answer some questions!',
    ],
    image: 'https://picsum.photos/800/450?random=1',
  },
  {
    type: 'question',
    title: 'Question 1: React',
    question: 'What company developed React?',
    options: [
      { id: 'a', text: 'Google' },
      { id: 'b', text: 'Meta (formerly Facebook)' },
      { id: 'c', text: 'Microsoft' },
      { id: 'd', text: 'Apple' },
    ],
    correctOptionId: 'b',
  },
  {
    type: 'content',
    title: 'The Power of Components',
    content: [
      'React is built around the concept of reusable components.',
      'Each component manages its own state, making complex UIs easier to build.',
      'This presentation itself is built with various React components!',
    ],
     image: 'https://picsum.photos/800/450?random=2',
  },
  {
    type: 'question',
    title: 'Question 2: State Management',
    question: 'Which hook is used to manage state in a functional component?',
    options: [
      { id: 'a', text: 'useEffect' },
      { id: 'b', text: 'useState' },
      { id: 'c', text: 'useContext' },
      { id: 'd', text: 'useReducer' },
    ],
    correctOptionId: 'b',
  },
  {
    type: 'question',
    title: 'Question 3: Styling',
    question: 'What CSS framework is used to style this application?',
    options: [
      { id: 'a', text: 'Bootstrap' },
      { id: 'b', text: 'Material-UI' },
      { id: 'c', text: 'Tailwind CSS' },
      { id: 'd', text: 'Styled Components' },
    ],
    correctOptionId: 'c',
  },
  {
    type: 'content',
    title: 'Thank you for participating!',
    content: [
        'Interactive sessions make learning more engaging and effective.',
        'You can check your final score on your device.'
    ],
    image: 'https://picsum.photos/800/450?random=3',
  },
];

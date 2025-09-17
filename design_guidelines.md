# SerrariEd Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from modern educational platforms like Khan Academy and Duolingo, with clean, trust-building aesthetics that emphasize learning and progress.

## Core Design Elements

### A. Color Palette
**Primary Colors:**
- Brand Blue: 220 85% 45% (professional, trustworthy)
- Success Green: 142 76% 36% (correct answers, achievements)
- Warning Orange: 35 84% 62% (areas needing improvement)
- Error Red: 0 84% 60% (incorrect answers)

**Supporting Colors:**
- Neutral Gray: 220 9% 46% (text, borders)
- Light Background: 220 14% 96% (card backgrounds)
- Dark Text: 220 25% 15% (primary text)

### B. Typography
- **Primary Font**: Inter (Google Fonts) - clean, readable
- **Headings**: 600-700 weight, sizes from text-xl to text-4xl
- **Body Text**: 400-500 weight, text-base to text-lg
- **UI Elements**: 500 weight for buttons and labels

### C. Layout System
**Tailwind Spacing**: Consistent use of units 4, 6, 8, 12, and 16 for spacing (p-4, m-6, gap-8, etc.)
- Container max-width: max-w-6xl centered
- Card padding: p-6 to p-8
- Section spacing: py-12 to py-16

### D. Component Library

**Navigation**: Clean header with logo, course selection, and progress indicators

**Course Cards**: Elevated cards (shadow-lg) with course icons, titles, and quick stats

**Quiz Interface**: 
- Question cards with clear typography hierarchy
- Multiple choice options with hover states using brand blue
- Progress bar showing question completion
- Timer display (optional)

**Results Dashboard**:
- Score visualization with circular progress indicators
- Performance breakdown by topic areas
- Recommendation cards linking to prep packages
- Social sharing components with branded share cards

**Forms & Inputs**: Rounded inputs (rounded-lg) with focus states using brand blue

### E. Key Features Design

**Landing Page**: Hero section with value proposition, course selection grid, testimonials, and CTA sections

**Challenge Test Flow**: 
- Course selection → Test interface → Results summary → Recommendations → Share options

**Sharing Mechanism**: Generate shareable cards with scores, course type, and SerrariEd branding

## Images
- **Hero Image**: Large background image of diverse students studying (subtle overlay for text readability)
- **Course Icons**: Professional icons for each certification (ACCA, HESI A2, etc.)
- **Success Illustrations**: Simple graphics for achievements and progress
- **Testimonial Photos**: Professional headshots for social proof

## Interaction Patterns
- Smooth transitions (duration-200 to duration-300)
- Hover states for interactive elements
- Loading states for test questions
- Success/error feedback with appropriate colors
- Mobile-responsive design with touch-friendly targets

## Brand Personality
Professional yet approachable, focusing on achievement and growth. Clean, modern aesthetic that builds trust while remaining engaging for educational content.
# Trello-like Task Management Board

A modern, responsive task management board built with Nuxt 3 and Vue 3, featuring drag-and-drop functionality similar to Trello.

## Features

- **Multiple Lists**: Create and manage multiple task lists with different colors
- **Draggable Cards**: Drag and drop cards between lists using vuedraggable
- **Task Management**: Add, edit, delete, and mark tasks as complete
- **Responsive Design**: Beautiful dark theme with gradient backgrounds
- **Real-time Updates**: Instant updates when moving cards between lists

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## How to Use

### Adding a New List

1. Click the "+ Add another list" button on the right side
2. Enter a name for your list
3. Press Enter or click "Add List"

### Adding Cards to Lists

1. Click "+ Add a card" at the bottom of any list
2. Type your task description
3. Press Enter or click "Add Card"

### Managing Cards

- **Complete a task**: Click the checkbox to mark as complete
- **Edit a card**: Click the pencil icon to edit the card content
- **Delete a card**: Click the trash icon to remove a card
- **Move cards**: Drag and drop cards between different lists

### Moving Cards Between Lists

- Simply drag any card from one list and drop it into another list
- Cards automatically update their position and list association

## Technology Stack

- **Frontend**: Nuxt 3, Vue 3, Composition API
- **Styling**: CSS3 with custom dark theme
- **Drag & Drop**: vuedraggable
- **Icons**: SVG icons for a clean, scalable interface

## Project Structure

```
app/
├── components/
│   ├── TaskList.vue      # Individual list component
│   └── TaskCard.vue      # Individual card component
├── pages/
│   └── index.vue         # Main board page
└── assets/
    └── css/
        └── main.css      # Global styles
```

## Customization

### Colors

You can customize the list colors by modifying the `getRandomColor()` function in `index.vue` or by setting specific colors for each list.

### Styling

The interface uses CSS custom properties and can be easily themed by modifying the CSS variables in the component files.

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

This project is open source and available under the MIT License.

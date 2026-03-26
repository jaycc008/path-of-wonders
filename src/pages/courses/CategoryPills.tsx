interface Category {
  name: string;
  count: number;
}

interface CategoryPillsProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

export default function CategoryPills({ 
  categories, 
  selectedCategory, 
  onCategorySelect 
}: CategoryPillsProps) {
  return (
    <div className="mb-6 sm:mb-8 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0">
      <div className="flex gap-2 sm:gap-3 md:flex-wrap min-w-max md:min-w-0">
        {categories.map((category) => (
          <button
            key={category.name}
            type="button"
            onClick={() => onCategorySelect(category.name)}
            className={`px-4 py-1.5 sm:px-6 sm:py-2 rounded-full font-semibold text-xs sm:text-sm transition-all duration-300 border whitespace-nowrap flex-shrink-0 ${
              selectedCategory === category.name
                ? 'bg-blue-600 text-white border-blue-700 scale-105 shadow-sm'
                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 shadow-sm'
            }`}
          >
            {category.name}
            <span className="ml-2 text-xs opacity-75">({category.count})</span>
          </button>
        ))}
      </div>
    </div>
  );
}


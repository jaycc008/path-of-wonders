import { useNavigate } from 'react-router-dom';
import { Book } from 'lucide-react';
import { Book as BookType } from '../api/course';
import SecondaryButton from './SecondaryButton';
import { encodeToBase64 } from '../utils/encoding';
import { buildBookCheckoutUrl } from '../constants/routes';

interface BookCardProps {
  book: BookType | null;
  isLoading?: boolean;
}

export default function BookCard({ book, isLoading = true }: BookCardProps) {
  const navigate = useNavigate();

  const handlePurchase = () => {
    if (!book) return;

    // Encode book data using UTF-8 safe encoding
    const bookJson = JSON.stringify({ book });
    const encodedBook = encodeToBase64(bookJson);
    
    // Build checkout URL with book data as query param
    const checkoutUrl = buildBookCheckoutUrl(encodedBook);
    
    // Navigate to book checkout page
    navigate(checkoutUrl);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mt-6">
        <div className="mb-4">
          {/* Skeleton for book cover */}
          <div className="w-full aspect-[2/3] rounded-lg overflow-hidden mb-4 border border-gray-200 bg-gray-200 animate-pulse relative">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-300 via-gray-200 to-transparent"></div>
            {/* Skeleton for author */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white/50"></div>
                <div className="flex-1">
                  <div className="h-3 w-16 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 w-24 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          </div>
          {/* Skeleton for title */}
          <div className="h-6 w-3/4 bg-gray-200 rounded mb-4 animate-pulse"></div>
          {/* Skeleton for price */}
          <div className="h-8 w-20 bg-gray-200 rounded mb-4 animate-pulse"></div>
        </div>
        {/* Skeleton for button */}
        <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  if (!book) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mt-6">
      <div className="mb-4">
        {book.cover_url && (
          <div className="w-full aspect-[2/3] rounded-lg overflow-hidden mb-4 border border-gray-200 relative">
            <img
              src={book.cover_url}
              alt={book.title}
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay at the bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none"></div>
            
            {/* Author information over the gradient */}
            {book.author && (
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-3">
                  {book.author.author_dp_url && (
                    <img
                      src={book.author.author_dp_url}
                      alt={book.author.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white/50"
                    />
                  )}
                  <div>
                    <p className="text-xs font-semibold text-white/80 uppercase tracking-wide">Author</p>
                    <p className="text-sm font-bold text-white">{book.author.name}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          {book.title}
        </h3>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-bold text-gray-900">${book.price}</span>
          <span className="text-xs text-gray-500 font-bold text-red-800">*(Printing and Shipping charges extra)*</span>
        </div>
      </div>

      <SecondaryButton
        onClick={handlePurchase}
        fullWidth
        icon={Book}
        iconPosition="left"
      >
        Purchase Book
      </SecondaryButton>
    </div>
  );
}


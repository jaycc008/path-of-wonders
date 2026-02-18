import { ArrowRight, X, AlertTriangle, FileText } from 'lucide-react';
import { Book as BookType } from '../api/course';
import { BookCostEstimationResponseData } from '../api/books';
import PrimaryButton from './PrimaryButton';

interface BookCostEstimationModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: BookType | null;
  costEstimation: BookCostEstimationResponseData | null;
  basePrice: number;
  paymentError?: string;
  isProcessing?: boolean;
  onConfirmPurchase: () => void;
}

export default function BookCostEstimationModal({
  isOpen,
  onClose,
  book,
  costEstimation,
  basePrice,
  paymentError,
  isProcessing = false,
  onConfirmPurchase,
}: BookCostEstimationModalProps) {
  if (!isOpen || !costEstimation) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-24">
          {/* Book Summary */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            {book && (
              <div className="flex flex-col md:flex-row gap-4 items-start">
                {book.cover_url && (
                  <img
                    src={book.cover_url}
                    alt={book.title}
                    className="w-full md:w-40 h-auto md:h-60 rounded-lg object-cover shadow-sm border border-gray-200 mx-auto md:mx-0"
                  />
                )}
                <div className="flex-1 w-full">
                  <h3 className="font-bold text-xl text-gray-900 mb-1">
                    {book.title}
                  </h3>
                  {book.author && (
                    <p className="text-sm text-gray-500 mb-4">
                      by <span className="font-medium">{book.author.name}</span>
                    </p>
                  )}
                  
                  {/* Book Specifications */}
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-4 h-4 text-gray-600" />
                      <h4 className="text-sm font-semibold text-gray-900">Book Specifications</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-700">
                      <div className="flex items-start gap-2">
                        <div>
                          <span className="font-medium">Trim Size:</span> 8.5" × 11"
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Color:</span> Black & White (BW)
                      </div>
                      <div>
                        <span className="font-medium">Quality:</span> Standard (STD)
                      </div>
                      <div>
                        <span className="font-medium">Binding:</span> Linen Wrap (LW)
                      </div>
                      <div className="sm:col-span-2">
                        <span className="font-medium">Paper:</span> 60# Uncoated White (060UW444) - 444 pages per inch bulk
                      </div>
                      <div>
                        <span className="font-medium">Cover:</span> Matte Coating (M)
                      </div>
                      <div>
                        <span className="font-medium">Linen:</span> Navy (N) with Golden Foil Stamping (G)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Content - Side by side on desktop, vertical on mobile */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Left Column - Price Details */}
            <div className="bg-white rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Price Details</h3>
              
              <div className="space-y-3">
                {/* Book Price */}
                <div className="flex justify-between text-gray-600">
                  <span>Book Price</span>
                  <span className="font-medium">${basePrice.toFixed(2)}</span>
                </div>

                {/* Discounts */}
                {costEstimation.total_discount_amount && parseFloat(costEstimation.total_discount_amount) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-${parseFloat(costEstimation.total_discount_amount).toFixed(2)}</span>
                  </div>
                )}

                {/* Calculate accumulated printing & fulfillment (includes line item costs) */}
                {(() => {
                  const lineItemTotal = costEstimation.line_item_costs?.reduce((sum, item) => 
                    sum + parseFloat(item.total_cost_incl_tax || '0'), 0) || 0;
                  const fulfillmentTotal = parseFloat(costEstimation.fulfillment_cost?.total_cost_incl_tax || '0');
                  const accumulatedTotal = lineItemTotal + fulfillmentTotal;
                  
                  return accumulatedTotal > 0 ? (
                    <div className="flex justify-between text-gray-600">
                      <span>Printing & Fulfillment</span>
                      <span className="font-medium">${accumulatedTotal.toFixed(2)}</span>
                    </div>
                  ) : null;
                })()}

                {/* Shipping Cost */}
                {costEstimation.shipping_cost && (
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-medium">${parseFloat(costEstimation.shipping_cost.total_cost_incl_tax).toFixed(2)}</span>
                  </div>
                )}

                {/* Fees */}
                {costEstimation.fees && costEstimation.fees.length > 0 && (
                  <>
                    {costEstimation.fees.map((fee, index) => (
                      <div key={index} className="flex justify-between text-gray-600 text-sm">
                        <span>{fee.fee_type}</span>
                        <span className="font-medium">${parseFloat(fee.total_cost_incl_tax).toFixed(2)}</span>
                      </div>
                    ))}
                  </>
                )}

                {/* Tax */}
                {costEstimation.total_tax && parseFloat(costEstimation.total_tax) > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span className="font-medium">${parseFloat(costEstimation.total_tax).toFixed(2)}</span>
                  </div>
                )}

                {/* Total */}
                <div className="pt-3 border-t border-gray-200 flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span>${parseFloat(costEstimation.total_cost_incl_tax).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Right Column - Shipping Address */}
            <div className="bg-white rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Shipping Information</h3>
              
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Shipping To:</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {costEstimation.shipping_address.street1}
                  {costEstimation.shipping_address.street2 && `, ${costEstimation.shipping_address.street2}`}
                  <br />
                  {costEstimation.shipping_address.city}, {costEstimation.shipping_address.state || costEstimation.shipping_address.state_code} {costEstimation.shipping_address.postcode}
                  <br />
                  {costEstimation.shipping_address.country || costEstimation.shipping_address.country_code}
                </p>
              </div>

              {/* Show warnings if any */}
              {costEstimation.shipping_address.warnings && costEstimation.shipping_address.warnings.length > 0 && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs font-semibold text-amber-800">Address Notice:</p>
                  </div>
                  {costEstimation.shipping_address.warnings.map((warning, index) => (
                    <p key={index} className="text-xs text-amber-700 ml-6 mb-1">
                      {warning.message}
                    </p>
                  ))}
                  {costEstimation.shipping_address.suggested_address && (
                    <div className="mt-2 ml-6">
                      <p className="text-xs font-medium text-gray-700 mb-1">Suggested address:</p>
                      <p className="text-xs text-gray-600">
                        {costEstimation.shipping_address.suggested_address.street1}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {paymentError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{paymentError}</p>
            </div>
          )}
        </div>

        {/* Fixed Action Button */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex-shrink-0">
          <PrimaryButton
            onClick={onConfirmPurchase}
            disabled={isProcessing}
            isLoading={isProcessing}
            size="lg"
            fullWidth
            icon={ArrowRight}
            iconPosition="right"
          >
            {isProcessing ? 'Redirecting to Stripe...' : `Proceed to Payment ($${parseFloat(costEstimation.total_cost_incl_tax).toFixed(2)})`}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}


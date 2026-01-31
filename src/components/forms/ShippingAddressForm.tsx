import { forwardRef } from 'react';
import { Formik, Field, Form, ErrorMessage, FormikProps } from 'formik';
import * as Yup from 'yup';
import { Truck } from 'lucide-react';

interface ShippingAddress {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface ShippingAddressFormProps {
  initialValues: ShippingAddress;
  billingAddress: ShippingAddress;
  onSubmit: (values: ShippingAddress) => void;
  sameAsBilling: boolean;
  onSameAsBillingChange: (same: boolean) => void;
}

const validationSchema = Yup.object({
  addressLine1: Yup.string()
    .min(3, 'Please enter a valid street address')
    .required('Street address is required'),
  addressLine2: Yup.string(),
  city: Yup.string()
    .min(2, 'Please enter your city')
    .required('City is required'),
  state: Yup.string()
    .min(2, 'Please enter your state/province')
    .required('State/Province is required'),
  postalCode: Yup.string()
    .min(3, 'Please enter a valid postal/ZIP code')
    .required('Postal/ZIP code is required'),
  country: Yup.string()
    .length(2, 'Please select a country')
    .required('Country is required'),
});

const countries = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'IT', label: 'Italy' },
  { value: 'ES', label: 'Spain' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'BE', label: 'Belgium' },
  { value: 'CH', label: 'Switzerland' },
  { value: 'AT', label: 'Austria' },
  { value: 'SE', label: 'Sweden' },
  { value: 'NO', label: 'Norway' },
  { value: 'DK', label: 'Denmark' },
  { value: 'FI', label: 'Finland' },
  { value: 'PL', label: 'Poland' },
  { value: 'IN', label: 'India' },
  { value: 'CN', label: 'China' },
  { value: 'JP', label: 'Japan' },
  { value: 'KR', label: 'South Korea' },
  { value: 'SG', label: 'Singapore' },
  { value: 'NZ', label: 'New Zealand' },
  { value: 'BR', label: 'Brazil' },
  { value: 'MX', label: 'Mexico' },
  { value: 'AR', label: 'Argentina' },
];

const ShippingAddressForm = forwardRef<FormikProps<ShippingAddress>, ShippingAddressFormProps>(
  ({ initialValues, billingAddress, onSubmit, sameAsBilling, onSameAsBillingChange }, ref) => {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600" />
            Shipping Address
          </h2>
        </div>
        <Formik
          innerRef={ref}
          initialValues={sameAsBilling ? billingAddress : initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          enableReinitialize
          key={sameAsBilling ? 'billing' : 'shipping'}
        >
          {({ errors, touched, setValues }) => {
            return (
              <Form>
                <div className="space-y-4">
                  {/* Same as Billing Checkbox */}
                  <div className="flex items-center gap-2 mb-4">
                    <input
                      type="checkbox"
                      id="sameAsBilling"
                      checked={sameAsBilling}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        onSameAsBillingChange(e.target.checked);
                        if (e.target.checked && setValues) {
                          setValues(billingAddress, false);
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="sameAsBilling" className="text-sm font-medium text-gray-700 cursor-pointer">
                      Same as billing address
                    </label>
                  </div>

                  {sameAsBilling ? (
                    /* Show message box when same as billing */
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        Shipping address is the same as billing address
                      </p>
                    </div>
                  ) : (
                    /* Show form fields when different from billing */
                    <>
                      {/* Address Line 1 */}
                      <div>
                        <label htmlFor="shipping_addressLine1" className="block text-sm font-medium text-gray-700 mb-2">
                          Street Address *
                        </label>
                        <Field
                          type="text"
                          id="shipping_addressLine1"
                          name="addressLine1"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                            errors.addressLine1 && touched.addressLine1 ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="123 Main Street"
                        />
                        <ErrorMessage name="addressLine1" component="p" className="mt-1 text-sm text-red-600" />
                      </div>

                      {/* Address Line 2 */}
                      <div>
                        <label htmlFor="shipping_addressLine2" className="block text-sm font-medium text-gray-700 mb-2">
                          Apartment, Suite, etc. (Optional)
                        </label>
                        <Field
                          type="text"
                          id="shipping_addressLine2"
                          name="addressLine2"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Apt 4B"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        {/* City */}
                        <div>
                          <label htmlFor="shipping_city" className="block text-sm font-medium text-gray-700 mb-2">
                            City *
                          </label>
                          <Field
                            type="text"
                            id="shipping_city"
                            name="city"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                              errors.city && touched.city ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="New York"
                          />
                          <ErrorMessage name="city" component="p" className="mt-1 text-sm text-red-600" />
                        </div>

                        {/* State/Province */}
                        <div>
                          <label htmlFor="shipping_state" className="block text-sm font-medium text-gray-700 mb-2">
                            State/Province *
                          </label>
                          <Field
                            type="text"
                            id="shipping_state"
                            name="state"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                              errors.state && touched.state ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="NY"
                          />
                          <ErrorMessage name="state" component="p" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        {/* Postal/ZIP Code */}
                        <div>
                          <label htmlFor="shipping_postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                            Postal/ZIP Code *
                          </label>
                          <Field
                            type="text"
                            id="shipping_postalCode"
                            name="postalCode"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                              errors.postalCode && touched.postalCode ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="10001"
                          />
                          <ErrorMessage name="postalCode" component="p" className="mt-1 text-sm text-red-600" />
                        </div>

                        {/* Country */}
                        <div>
                          <label htmlFor="shipping_country" className="block text-sm font-medium text-gray-700 mb-2">
                            Country *
                          </label>
                          <Field
                            as="select"
                            id="shipping_country"
                            name="country"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                              errors.country && touched.country ? 'border-red-500' : 'border-gray-300'
                            }`}
                          >
                            {countries.map((country) => (
                              <option key={country.value} value={country.value}>
                                {country.label}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage name="country" component="p" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    );
  }
);

ShippingAddressForm.displayName = 'ShippingAddressForm';

export default ShippingAddressForm;


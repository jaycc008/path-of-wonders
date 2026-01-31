import { forwardRef } from 'react';
import { Formik, Field, Form, ErrorMessage, FormikProps } from 'formik';
import * as Yup from 'yup';
import { Sparkles } from 'lucide-react';

interface ContactInfoFormProps {
  initialValues: {
    name: string;
    email: string;
  };
  onSubmit: (values: { name: string; email: string }) => void;
}

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Full name is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email address is required'),
});

const ContactInfoForm = forwardRef<FormikProps<{ name: string; email: string }>, ContactInfoFormProps>(
  ({ initialValues, onSubmit }, ref) => {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          Contact Information
        </h2>
        <Formik
          innerRef={ref}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {() => (
            <Form>
              <div className="space-y-4">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <Field
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                  <ErrorMessage name="name" component="p" className="mt-1 text-sm text-red-600" />
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="your.email@example.com"
                  />
                  <ErrorMessage name="email" component="p" className="mt-1 text-sm text-red-600" />
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
);

ContactInfoForm.displayName = 'ContactInfoForm';

export default ContactInfoForm;


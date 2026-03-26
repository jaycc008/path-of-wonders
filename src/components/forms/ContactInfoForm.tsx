import { forwardRef } from 'react';
import { Formik, Field, Form, FormikProps } from 'formik';
import * as Yup from 'yup';
import { UserCircle2 } from 'lucide-react';
import FormField from './fields/FormField';
import FormInput from './fields/FormInput';

interface ContactInfoFormProps {
  initialValues: {
    name: string;
    email: string;
    phone: string;
  };
  onSubmit: (values: { name: string; email: string; phone: string }) => void;
}

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Full name is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email address is required'),
  phone: Yup.string()
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, 'Please enter a valid phone number')
    .required('Phone number is required'),
});

const ContactInfoForm = forwardRef<FormikProps<{ name: string; email: string; phone: string }>, ContactInfoFormProps>(
  ({ initialValues, onSubmit }, ref) => {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <UserCircle2 className="w-5 h-5 text-blue-600" />
          Contact Information
        </h2>
        <Formik
          innerRef={ref}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {({ errors, touched }) => (
            <Form>
              <div className="space-y-4">
                {/* Name Field */}
                <FormField id="name" label="Full Name" required error={touched.name ? errors.name : undefined}>
                  <Field
                    as={FormInput}
                    type="text"
                    id="name"
                    name="name"
                    hasError={Boolean(errors.name && touched.name)}
                    placeholder="John Doe"
                  />
                </FormField>

                {/* Email Field */}
                <FormField id="email" label="Email Address" required error={touched.email ? errors.email : undefined}>
                  <Field
                    as={FormInput}
                    type="email"
                    id="email"
                    name="email"
                    hasError={Boolean(errors.email && touched.email)}
                    placeholder="your.email@example.com"
                  />
                </FormField>

                {/* Phone Field */}
                <FormField id="phone" label="Phone Number" required error={touched.phone ? errors.phone : undefined}>
                  <Field
                    as={FormInput}
                    type="tel"
                    id="phone"
                    name="phone"
                    hasError={Boolean(errors.phone && touched.phone)}
                    placeholder="+1 (555) 123-4567"
                  />
                </FormField>
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


import { useEffect, useState } from 'react'
import { fetchCaptcha, sendComment } from '../api'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import validationSchema from '../utils/validators'

export default function CommentForm({ parentId = null, onCancel }) {
  const [captcha, setCaptcha] = useState(null)
  const [file, setFile] = useState(null)

  const loadCaptcha = async () => {
    const data = await fetchCaptcha()
    setCaptcha(data)
  }

  useEffect(() => {
    loadCaptcha()
  }, [])

  const initialValues = {
    userName: '',
    email: '',
    homePage: '',
    text: '',
    captchaText: '',
    captchaId: captcha?.id || '',
    parentId,
  }

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      values.captcha = {
        id: captcha.id,
        text: values.captchaText,
      }
      delete values.captchaText

      if (file) {
        values.file = file
      }

      await sendComment(values)
      resetForm()
      setFile(null)
      loadCaptcha()
      if (onCancel) onCancel()

      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new Event('comment_added'))
      }
    } catch (e) {
      alert(e.response?.data?.message || e.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleFileChange = (e, setFieldValue) => {
    const selectedFile = e.currentTarget.files[0]
    setFile(selectedFile)
    setFieldValue('file', selectedFile)
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, setFieldValue }) => (
        <Form
          style={{
            marginTop: 20,
            marginBottom: 20,
            border: '1px solid #ccc',
            padding: 10,
          }}
        >
          <div>
            <label>User Name *</label>
            <Field name="userName" />
            <ErrorMessage
              name="userName"
              component="div"
              style={{ color: 'red' }}
            />
          </div>

          <div>
            <label>Email *</label>
            <Field name="email" type="email" />
            <ErrorMessage
              name="email"
              component="div"
              style={{ color: 'red' }}
            />
          </div>

          <div>
            <label>Home page</label>
            <Field name="homePage" />
            <ErrorMessage
              name="homePage"
              component="div"
              style={{ color: 'red' }}
            />
          </div>

          <div>
            <label>Text *</label>
            <Field name="text" as="textarea" rows={4} />
            <ErrorMessage
              name="text"
              component="div"
              style={{ color: 'red' }}
            />
          </div>

          <div>
            <label>Attachment (image or txt)</label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.gif,.txt"
              onChange={(e) => handleFileChange(e, setFieldValue)}
            />
          </div>

          <div>
            <label>CAPTCHA *</label>
            {captcha && (
              <div
                dangerouslySetInnerHTML={{ __html: captcha.data }}
                style={{ marginBottom: 5 }}
              />
            )}
            <button type="button" onClick={loadCaptcha}>
              Refresh CAPTCHA
            </button>
            <Field name="captchaText" />
            <ErrorMessage
              name="captchaText"
              component="div"
              style={{ color: 'red' }}
            />
          </div>

          <button type="submit" disabled={isSubmitting}>
            {parentId ? 'Reply' : 'Send Comment'}
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} style={{ marginLeft: 10 }}>
              Cancel
            </button>
          )}
        </Form>
      )}
    </Formik>
  )
}

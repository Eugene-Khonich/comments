import { useEffect, useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import styles from './CommentForm.module.css'
import { fetchCaptcha, sendComment } from '../../api/comments'
import validationSchema from '../../utils/validators'

export default function CommentForm() {
  const [captchaImage, setCaptchaImage] = useState(null)
  const [captchaId, setCaptchaId] = useState(null)

  const loadCaptcha = async () => {
    try {
      const { id, data } = await fetchCaptcha()
      setCaptchaImage(data)
      setCaptchaId(id)
    } catch (error) {
      console.error('Failed to load CAPTCHA', error)
    }
  }

  useEffect(() => {
    loadCaptcha()
  }, [])

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const payload = {
        ...values,
        captchaId,
      }
      await sendComment(payload)
      resetForm()
      await loadCaptcha()
    } catch (err) {
      console.error('Submit error:', err)
    }
  }

  return (
    <div className={styles.formWrapper}>
      <Formik
        initialValues={{
          userName: '',
          email: '',
          homePage: '',
          text: '',
          captcha: '',
          file: null,
        }}
        validate={(values) => {
          const { error } = validationSchema.validate(values, {
            abortEarly: false,
          })
          if (!error) return {}

          return error.details.reduce((acc, curr) => {
            acc[curr.path[0]] = curr.message
            return acc
          }, {})
        }}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form className={styles.form} noValidate>
            <label>
              User Name*:
              <Field name="userName" type="text" />
              <ErrorMessage
                name="userName"
                component="div"
                className={styles.error}
              />
            </label>

            <label>
              Email*:
              <Field name="email" type="email" />
              <ErrorMessage
                name="email"
                component="div"
                className={styles.error}
              />
            </label>

            <label>
              Home Page:
              <Field name="homePage" type="url" />
              <ErrorMessage
                name="homePage"
                component="div"
                className={styles.error}
              />
            </label>

            <label>
              Comment*:
              <Field name="text" as="textarea" rows="4" />
              <ErrorMessage
                name="text"
                component="div"
                className={styles.error}
              />
            </label>

            <label>
              Attachment (JPG, PNG, GIF, TXT):
              <input
                name="file"
                type="file"
                accept=".jpg,.jpeg,.png,.gif,.txt"
                onChange={(e) => {
                  setFieldValue('file', e.currentTarget.files[0])
                }}
              />
            </label>

            <label>
              CAPTCHA*:
              {captchaImage && (
                <div className={styles.captchaWrapper}>
                  <div
                    dangerouslySetInnerHTML={{ __html: captchaImage }}
                    className={styles.captchaImage}
                  />
                  <button
                    type="button"
                    onClick={loadCaptcha}
                    className={styles.refreshButton}
                    title="Refresh CAPTCHA"
                  >
                    ↻
                  </button>
                </div>
              )}
              <Field name="captcha" type="text" autoComplete="off" />
              <ErrorMessage
                name="captcha"
                component="div"
                className={styles.error}
              />
            </label>

            <button type="submit" className={styles.submitButton}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { fetchCaptcha, sendComment, fetchPreview } from '../api'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import validationSchema from '../utils/validators'
import styles from './CommentForm.module.css'

export default function CommentForm({ parentId = null, onCancel }) {
  const [captcha, setCaptcha] = useState(null)
  const [file, setFile] = useState(null)
  const [previewHtml, setPreviewHtml] = useState(null)

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
      setPreviewHtml(null)
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

  const handlePreview = async (values) => {
    try {
      const data = await fetchPreview(values.text)
      setPreviewHtml(data.preview)
    } catch (e) {
      alert(e.response?.data?.message || 'Error loading preview')
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, setFieldValue, values }) => {
        const insertTag = (tag, attrs = '') => {
          const textarea = document.querySelector('textarea[name="text"]')
          if (!textarea) return

          const start = textarea.selectionStart
          const end = textarea.selectionEnd
          const selectedText = textarea.value.slice(start, end)
          const before = textarea.value.slice(0, start)
          const after = textarea.value.slice(end)

          const opening = `<${tag}${attrs ? ' ' + attrs : ''}>`
          const closing = `</${tag}>`

          const newText = before + opening + selectedText + closing + after
          setFieldValue('text', newText)

          setTimeout(() => {
            textarea.focus()
            textarea.setSelectionRange(
              start + opening.length,
              start + opening.length + selectedText.length
            )
          }, 0)
        }

        return (
          <Form className={styles.form}>
            <div>
              <label className={styles.label}>User Name *</label>
              <Field name="userName" className={styles.input} />
              <ErrorMessage
                name="userName"
                component="div"
                className={styles.error}
              />
            </div>

            <div>
              <label className={styles.label}>Email *</label>
              <Field name="email" type="email" className={styles.input} />
              <ErrorMessage
                name="email"
                component="div"
                className={styles.error}
              />
            </div>

            <div>
              <label className={styles.label}>Home page</label>
              <Field name="homePage" className={styles.input} />
              <ErrorMessage
                name="homePage"
                component="div"
                className={styles.error}
              />
            </div>

            <div className={styles.toolbar}>
              <button
                type="button"
                className={styles.toolbarButton}
                onClick={() => insertTag('i')}
              >
                i
              </button>
              <button
                type="button"
                className={styles.toolbarButton}
                onClick={() => insertTag('strong')}
              >
                strong
              </button>
              <button
                type="button"
                className={styles.toolbarButton}
                onClick={() => insertTag('code')}
              >
                code
              </button>
              <button
                type="button"
                className={styles.toolbarButton}
                onClick={() =>
                  insertTag('a', 'href="https://example.com" title="link"')
                }
              >
                a
              </button>
            </div>

            <div>
              <label className={styles.label}>Text *</label>
              <Field
                name="text"
                as="textarea"
                className={styles.textarea}
                rows={4}
              />
              <ErrorMessage
                name="text"
                component="div"
                className={styles.error}
              />
            </div>

            <div>
              <label className={styles.label}>Attachment (image or txt)</label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.gif,.txt"
                onChange={(e) => handleFileChange(e, setFieldValue)}
                className={styles.fileInput}
              />
            </div>

            <div className={styles.captchaWrapper}>
              <div>
                <label className={styles.label}>CAPTCHA *</label>
                {captcha && (
                  <div
                    className={styles.captchaImage}
                    dangerouslySetInnerHTML={{ __html: captcha.data }}
                  />
                )}
                <button
                  type="button"
                  onClick={loadCaptcha}
                  className={styles.refreshCaptchaButton}
                >
                  Refresh CAPTCHA
                </button>
              </div>
              <div>
                <Field name="captchaText" className={styles.input} />
                <ErrorMessage
                  name="captchaText"
                  component="div"
                  className={styles.error}
                />
              </div>
            </div>

            <div className={styles.previewButtonWrapper}>
              <button
                type="button"
                onClick={() => handlePreview(values)}
                className={styles.previewButton}
              >
                Preview
              </button>
            </div>

            {previewHtml && (
              <div className={styles.preview}>
                <h4>Preview:</h4>
                <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
              </div>
            )}

            <div className={styles.buttonGroup}>
              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                {parentId ? 'Reply' : 'Send Comment'}
              </button>
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              )}
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}

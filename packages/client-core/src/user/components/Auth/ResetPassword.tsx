import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Button from '@etherealengine/ui/src/Button'
import Container from '@etherealengine/ui/src/Container'
import TextField from '@etherealengine/ui/src/TextField'
import Typography from '@etherealengine/ui/src/Typography'

import EmptyLayout from '../../../common/components/EmptyLayout'
import styles from './index.module.scss'

interface Props {
  token?: string
  completeAction?: () => void
  resetPassword: (token: string, password: string) => void
}

const ResetPassword = ({ token = '', completeAction, resetPassword }: Props): JSX.Element => {
  const initialState = { password: '' }
  const [state, setState] = useState(initialState)
  const { t } = useTranslation()

  const handleInput = (e: any): void => {
    e.preventDefault()
    setState({ ...state, [e.target.name]: e.target.value })
  }
  const handleReset = (e: any): void => {
    e.preventDefault()
    resetPassword(token, state.password)
    if (completeAction) completeAction()
  }

  return (
    <EmptyLayout>
      <Container component="main" maxWidth="xs">
        <div className={styles.paper}>
          <Typography component="h1" variant="h5">
            {t('user:auth.resetPassword.header')}
          </Typography>
          <Typography variant="body2" color="textSecondary" align="center">
            {t('user:auth.resetPassword.description')}
          </Typography>
          <form className={styles.form} noValidate onSubmit={(e) => handleReset(e)}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="password"
              label={t('user:auth.resetPassword.lbl-password')}
              name="password"
              autoComplete="password"
              autoFocus
              onChange={(e) => handleInput(e)}
            />
            <Button type="submit" fullWidth variant="contained" color="primary" className={styles.submit}>
              {t('user:auth.resetPassword.lbl-submit')}
            </Button>
          </form>
        </div>
      </Container>
    </EmptyLayout>
  )
}

export default ResetPassword

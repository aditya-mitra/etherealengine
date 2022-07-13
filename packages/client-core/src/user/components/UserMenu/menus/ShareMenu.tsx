import { QRCodeSVG } from 'qrcode.react'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { isShareAvailable } from '@xrengine/engine/src/common/functions/DetectFeatures'
import { EngineActions, useEngineState } from '@xrengine/engine/src/ecs/classes/EngineState'
import { dispatchAction } from '@xrengine/hyperflux'

import { CheckBox, CheckBoxOutlineBlank, FileCopy, IosShare, Send } from '@mui/icons-material'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { NotificationService } from '../../../../common/services/NotificationService'
import { InviteService } from '../../../../social/services/InviteService'
import { useInviteState } from '../../../../social/services/InviteService'
import { useAuthState } from '../../../services/AuthService'
import styles from '../index.module.scss'

export const useShareMenuHooks = ({ refLink }) => {
  const { t } = useTranslation()
  const [email, setEmail] = React.useState('')
  const [isSpectatorMode, setSpectatorMode] = useState<boolean>(false)
  const [shareLink, setShareLink] = useState('')
  const postTitle = 'AR/VR world'
  const siteTitle = 'XREngine'
  const inviteState = useInviteState()
  const engineState = useEngineState()

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(refLink.current.value)
    NotificationService.dispatchNotify(t('user:usermenu.share.linkCopied'), { variant: 'success' })
  }
  const selfUser = useAuthState().user

  const shareOnApps = () => {
    navigator
      .share({
        title: `${postTitle} | ${siteTitle}`,
        text: `Check out ${postTitle} on ${siteTitle}`,
        url: document.location.href
      })
      .then(() => {
        console.log('Successfully shared')
      })
      .catch((error) => {
        console.error('Something went wrong sharing the world', error)
      })
  }

  const packageInvite = async (): Promise<void> => {
    const sendData = {
      type: 'friend',
      token: email,
      inviteCode: null,
      identityProviderType: 'email',
      targetObjectId: inviteState.targetObjectId.value,
      invitee: null
    }
    InviteService.sendInvite(sendData)
    setEmail('')
  }

  const handleChangeEmail = (e) => {
    setEmail(e.target.value)
  }

  const getInviteLink = () => {
    const location = new URL(window.location as any)
    let params = new URLSearchParams(location.search)
    if (selfUser?.inviteCode.value != null) {
      params.append('inviteCode', selfUser.inviteCode.value)
      location.search = params.toString()
      return location.toString()
    } else {
      return location.toString()
    }
  }

  const getSpectateModeUrl = () => {
    const location = new URL(window.location as any)
    let params = new URLSearchParams(location.search)
    params.append('spectate', selfUser.id.value)
    location.search = params.toString()
    return location.toString()
  }

  const toggleSpectatorMode = () => {
    setSpectatorMode(!isSpectatorMode)
  }

  useEffect(() => {
    if (engineState.shareLink.value !== '') setShareLink(engineState.shareLink.value)
    else setShareLink(isSpectatorMode ? getSpectateModeUrl() : getInviteLink())
  }, [engineState.shareLink.value])

  return {
    copyLinkToClipboard,
    shareOnApps,
    packageInvite,
    handleChangeEmail,
    email,
    shareLink,
    toggleSpectatorMode
  }
}

interface Props {}

const ShareMenu = (props: Props): JSX.Element => {
  const { t } = useTranslation()
  const refLink = useRef() as React.MutableRefObject<HTMLInputElement>
  const engineState = useEngineState()
  const { copyLinkToClipboard, shareOnApps, packageInvite, handleChangeEmail, email, shareLink, toggleSpectatorMode } =
    useShareMenuHooks({
      refLink
    })

  useEffect(() => {
    return () => dispatchAction(EngineActions.shareInteractableLink({ shareLink: '', shareTitle: '' }))
  }, [])

  return (
    <div className={styles.menuPanel}>
      <div className={styles.sharePanel}>
        {engineState.shareTitle.value ? (
          <Typography variant="h2" className={styles.title}>
            {engineState.shareTitle.value}
          </Typography>
        ) : (
          <>
            <Typography variant="h1" className={styles.panelHeader}>
              {t('user:usermenu.share.title')}
            </Typography>
            <FormControlLabel
              classes={{
                label: styles.label,
                root: styles.formRoot
              }}
              control={
                <Checkbox
                  className={styles.checkboxMode}
                  icon={<CheckBoxOutlineBlank fontSize="small" />}
                  checkedIcon={<CheckBox fontSize="small" />}
                  name="checked"
                  color="primary"
                  onChange={toggleSpectatorMode}
                />
              }
              label={t('user:usermenu.share.lbl-spectator-mode')}
            />
          </>
        )}
        <div className={styles.QRContainer}>
          <QRCodeSVG height={176} width={200} value={shareLink} />
        </div>
        <TextField
          className={styles.copyField}
          size="small"
          variant="outlined"
          value={shareLink}
          disabled={true}
          inputRef={refLink}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" onClick={copyLinkToClipboard}>
                <FileCopy />
              </InputAdornment>
            )
          }}
        />
        <TextField
          className={styles.emailField}
          size="small"
          placeholder={t('user:usermenu.share.ph-phoneEmail')}
          variant="outlined"
          value={email}
          onChange={(e) => handleChangeEmail(e)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" onClick={packageInvite}>
                <Send />
              </InputAdornment>
            )
          }}
        />
        {isShareAvailable && (
          <div className={styles.shareBtnContainer}>
            <Button className={styles.shareBtn} onClick={shareOnApps} endIcon={<IosShare />}>
              {t('user:usermenu.share.lbl-share')}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ShareMenu

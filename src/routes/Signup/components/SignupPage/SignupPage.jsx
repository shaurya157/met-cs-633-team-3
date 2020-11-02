import React from 'react'
import { Link } from 'react-router-dom'
import GoogleButton from 'react-google-button'
import Paper from '@material-ui/core/Paper'
import { useAuth, useDatabase } from 'reactfire'
import { makeStyles } from '@material-ui/core/styles'
import { LOGIN_PATH, PROFILE_PATH } from 'constants/paths'
import { useNotifications } from 'modules/notification'
import SignupForm from '../SignupForm'
import styles from './SignupPage.styles'
import { useEmailSignup } from 'utils/databaseUtils'
import { USERS_COLLECTION } from 'constants/firebasePaths'

const useStyles = makeStyles(styles)

function SignupPage() {
  const classes = useStyles()
  const { showError } = useNotifications()
  const auth = useAuth()
  const { GoogleAuthProvider } = useAuth
  const database = useDatabase()

  async function googleLogin() {
    const provider = new GoogleAuthProvider()
    try {
      await auth.signInWithPopup(provider)
      // NOTE: window.location used since history.push/replace does not always work
      window.location = PROFILE_PATH
    } catch (err) {
      showError(err.message)
    }
  }

  async function emailSignup(formValues) {
    try {
      await auth.createUserWithEmailAndPassword(
        formValues.email,
        formValues.password
      ).then(function({user}) {
        var data = {
          email: user.email,
          username: formValues.username
        }

        database.ref(`${USERS_COLLECTION}/${user.uid}`)
        .set(data)
      })

      // NOTE: window.location used since history.push/replace does not always work
      window.location = PROFILE_PATH
    } catch (err) {
      showError(err.message)
    }
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.panel}>
        <SignupForm onSubmit={emailSignup} />
      </Paper>
      <div className={classes.orLabel}>or</div>
      <div className={classes.providers}>
        <GoogleButton onClick={googleLogin} data-test="google-auth-button" />
      </div>
      <div className={classes.login}>
        <span className={classes.loginLabel}>Already have an account?</span>
        <Link className={classes.loginLink} to={LOGIN_PATH}>
          Login
        </Link>
      </div>
    </div>
  )
}

export default SignupPage

import React from 'react'
import LoginError from '../components/LoginError'
import { useSelector } from 'react-redux'
import LoginLoading from '../components/LoginLoading'

function LandingPage() {
    const {currentUser, loginLoading, loginError} = useSelector(state => state.user)
    if(loginError){
        return <LoginError/>
    }
    if(loginLoading){
        return <LoginLoading/>
    }
  return (
    <div>LandingPage</div>
  )
}

export default LandingPage
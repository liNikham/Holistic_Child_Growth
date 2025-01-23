import React from 'react'
import { Link } from 'react-router-dom'
function LoginError() {
  return (
    <div className='m-2 p-2 flex flex-col justify-center items-center gap-2'>
        <span>Error occured while logging in</span>
        <div>
            <Link to="/login" >
                Try Again
            </Link>
        </div>
    </div>
  )
}

export default LoginError
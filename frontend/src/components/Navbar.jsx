import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

function Navbar() {
    const { currentUser, loginLoading, loginError } = useSelector(state => state.user)
    const navRoutes = [
        { name: "Dashboard", route: "/dashboard" },
        { name: "Daily Capture", route: "/dailyCapture" },
        { name: "Historic", route: "/historic" },
        { name: "Plans", route: "/plans" },
    ]


    return (
        <div className='flex justify-between items-center w-full p-2'>
            <span>TrackMilestone</span>
           {currentUser && <div className='flex justify-center items-center'>
                {navRoutes && navRoutes.map((routes, index) => (
                    <div key={routes.route} className='mx-2'>
                        <Link to={routes.route}>
                            {routes.name}
                        </Link>
                    </div>
                ))}
            </div>}
            <div className='flex justify-center items-center gap-2'>
                <span>{currentUser ? "Logout" :
                    <Link to="/login">login</Link>
                }
                </span>
                <span>Avatar</span>
            </div>
        </div>
    )
}

export default Navbar
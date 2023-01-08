import Link from 'next/link'
import React from 'react'

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <div className='flex justify-between text-gray px-10 py-5 bg-white'>
            <div className='flex'>
                <Link href="/">
                    <img src="/smallLogo.svg" alt="techspecs logo" />
                </Link>
                <p>© {currentYear} TechSpecs, Inc.</p>
            </div>
            <div>
                <Link className='mx-4' href="/">
                    Visit TechSpecs
                </Link>
                <Link className='mx-4' href="/">
                    Privacy Policy
                </Link>
                <Link className='mx-4' href="/">
                    Terms of Service
                </Link>
                <Link className='mx-4' href="/">
                    Help Center
                </Link>
            </div>
        </div>
    )
}

export default Footer
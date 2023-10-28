/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode:true,
    compiler:{
        styledComponents: true
    },
    env: {
        customKey: 'my-value',
    },
    
}

module.exports = nextConfig

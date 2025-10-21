/** @type {import('next').NextConfig} */
const nextConfig = {
  // Добавляем базовый путь если нужно
  basePath: process.env.NODE_ENV === 'production' ? '/growcery-admin' : '',
  experimental: {
    ppr: 'incremental',
  },
}

export default nextConfig

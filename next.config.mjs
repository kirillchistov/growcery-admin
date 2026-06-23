import path from 'path'
import { fileURLToPath } from 'url'

const projectRoot = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prevent Next.js from treating the parent NextJS folder as the workspace root.
  outputFileTracingRoot: projectRoot,
}

export default nextConfig

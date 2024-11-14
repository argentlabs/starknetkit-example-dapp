/** @type {import('next').NextConfig} */
import p from "./package.json" assert { type: "json" }
import path from "path"
import { fileURLToPath } from "url"
import { createRequire } from "module"

const require = createRequire(import.meta.url)

const starknetkitNextVersion = Object.entries(p.dependencies)
  .find((dep) => dep[0] === "starknetkit-next")[1]
  .replace("^", "")
  .replace("npm:", "")
  .split("@")[1]
const starknetkitLatestVersion = Object.entries(p.dependencies)
  .find((dep) => dep[0] === "starknetkit-latest")[1]
  .replace("^", "")
  .replace("npm:", "")
  .split("@")[1]

const starknetReactVersion = Object.entries(p.dependencies)
  .find((dep) => dep[0] === "@starknet-react/core")[1]
  .replace("^", "")
  .replace("npm:", "")
  .split("@")[0]

const starknetReactNextVersion = Object.entries(p.dependencies)
  .find((dep) => dep[0] === "starknet-react-core-next")[1]
  .replace("^", "")
  .replace("npm:", "")
  .split("@")[2]

const localPackages = [
  {
    name: "starknetkit-next",
    path: "../starknetkit",
  },
]

const nextConfig = {
  productionBrowserSourceMaps: true,
  env: {
    starknetkitNextVersion,
    starknetkitLatestVersion,
    starknetReactVersion,
    starknetReactNextVersion,
  },
  webpack: (config, { dev, webpack }) => {
    if (!dev) {
      return config
    }

    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const packageJson = require(path.join(__dirname, "./package.json"))

    config.resolve.alias = {
      ...config.resolve.alias,
      ...localPackages.reduce((aliases, pkg) => {
        if (packageJson.dependencies[pkg.name].startsWith("file:")) {
          return {
            ...aliases,
            [pkg.name]: path.resolve(__dirname, pkg.path),
            [`${pkg.name}/(.*)`]: path.resolve(__dirname, `${pkg.path}/$1`),
          }
        }

        return { ...aliases }
      }, {}),
    }

    localPackages.forEach((pkg) => {
      if (!packageJson.dependencies[pkg.name].startsWith("file:")) {
        return
      }
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          new RegExp(`^${pkg.name}(\\/.*)?$`),
          (resource) => {
            const requestPath = resource.request.replace(pkg.name, "")
            resource.request = path.resolve(
              __dirname,
              `${pkg.path}${requestPath}`,
            )
            resource.context = path.dirname(resource.request)
          },
        ),
      )
    })

    return config
  },
}

export default nextConfig

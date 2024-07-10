/** @type {import('next').NextConfig} */
import p from "./package.json" assert { type: "json" }

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

const nextConfig = {
  productionBrowserSourceMaps: true,
  env: {
    starknetkitNextVersion,
    starknetkitLatestVersion,
    starknetReactVersion,
    starknetReactNextVersion,
  },
}

export default nextConfig
